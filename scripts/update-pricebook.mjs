import { readFile, writeFile } from "node:fs/promises";

const file = new URL("../data/pricebook.json", import.meta.url);
const existing = JSON.parse(await readFile(file, "utf8"));
const response = await fetch("https://openrouter.ai/api/v1/models", {
  headers: { "User-Agent": "token-pricebook-daily/1.0" },
});
if (!response.ok) throw new Error(`OpenRouter returned ${response.status}`);
const payload = await response.json();
const models = Array.isArray(payload.data) ? payload.data : [];
const closedVendors = ["openai", "anthropic", "google", "mistral", "cohere", "x-ai", "perplexity"];
const openVendors = ["meta-llama", "deepseek", "qwen", "microsoft", "moonshotai", "nvidia", "nousresearch", "01-ai"];
const pick = models
  .filter((model) => model?.pricing?.prompt && model?.pricing?.completion)
  .map((model) => {
    const id = String(model.id || "");
    const vendor = id.split("/")[0].toLowerCase();
    const segment = openVendors.includes(vendor) ? "Open" : closedVendors.includes(vendor) ? "Closed" : null;
    if (!segment) return null;
    const input = Number(model.pricing.prompt) * 1_000_000;
    const output = Number(model.pricing.completion) * 1_000_000;
    if (!Number.isFinite(input) || !Number.isFinite(output) || input <= 0 || output <= 0) return null;
    return { provider: vendor, model: String(model.name || id), segment, input: Number(input.toFixed(6)), output: Number(output.toFixed(6)), outputMix: 0.25, usage: 1 };
  })
  .filter(Boolean)
  .filter((row, index, all) => all.findIndex((item) => item.model === row.model) === index)
  .slice(0, 30);
if (pick.length < 3) throw new Error("Not enough priced models were returned");
const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo" }).format(new Date());
const previous = existing.rows.filter((row) => row.date !== date);
const usageByModel = new Map(existing.rows.map((row) => [row.model, row.usage]));
const daily = pick.map((row) => ({ date, ...row, usage: usageByModel.get(row.model) || row.usage }));
await writeFile(file, JSON.stringify({ updatedAt: new Date().toISOString(), source: "OpenRouter public model pricing API", rows: [...previous, ...daily] }, null, 2) + "\n");
console.log(`Stored ${daily.length} model prices for ${date}`);
