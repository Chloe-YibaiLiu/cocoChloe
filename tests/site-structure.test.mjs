import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");

test("site exposes root, zh, and en language entry paths", () => {
  assert.ok(existsSync(join(root, "index.html")), "root index.html should exist");
  assert.ok(existsSync(join(root, "zh/index.html")), "zh/index.html should exist");
  assert.ok(existsSync(join(root, "en/index.html")), "en/index.html should exist");

  const rootHtml = read("index.html");
  assert.match(rootHtml, /href="\.\/zh\/"/, "root page should link to /zh/");
  assert.match(rootHtml, /href="\.\/en\/"/, "root page should link to /en/");

  assert.match(read("zh/index.html"), /<html lang="zh-CN">/, "zh page should declare zh-CN");
  assert.match(read("en/index.html"), /<html lang="en">/, "en page should declare en");
});


test("zh and en pages expose the personal positioning and public links", () => {
  const zh = read("zh/index.html");
  const en = read("en/index.html");

  assert.match(zh, /95 后 AI Agent 创业者/);
  assert.match(zh, /算法 \/ 产品 \/ 全栈/);
  assert.match(zh, /深度 vibe coder/);
  assert.doesNotMatch(zh, /朋友|投资人|合作者|Audience/);

  assert.match(en, /post-95 AI Agent founder/);
  assert.match(en, /algorithm \/ product \/ full-stack/);
  assert.match(en, /deep vibe coder/);
  assert.doesNotMatch(en, /friends|investors|collaborators|Audience/);

  for (const html of [zh, en]) {
    assert.match(html, /href="https:\/\/github.com\/Chloe-YibaiLiu"/);
    assert.match(html, /href="mailto:ybliu99ggg@gmail.com"/);
    assert.match(html, /href="https:\/\/xhslink.com\/m\/1GRKg26YODu"/);
    assert.match(html, /href="\.\.\/portfolio\/"/);
    assert.match(html, /href="\.\.\/resume\/"/);
  }
});


test("zh and en pages present a coherent narrative order", () => {
  const zh = read("zh/index.html");
  const en = read("en/index.html");

  const zhOrder = ["我在做什么", "能力组合", "继续了解"];
  const enOrder = ["What I am building", "Working stack", "Continue reading"];

  for (const [first, second] of zhOrder.slice(0, -1).map((item, index) => [item, zhOrder[index + 1]])) {
    assert.ok(zh.indexOf(first) > -1, `${first} should exist in zh page`);
    assert.ok(zh.indexOf(first) < zh.indexOf(second), `${first} should appear before ${second}`);
  }
  assert.ok(zh.indexOf(zhOrder.at(-1)) > -1, "Continue section should exist in zh page");

  for (const [first, second] of enOrder.slice(0, -1).map((item, index) => [item, enOrder[index + 1]])) {
    assert.ok(en.indexOf(first) > -1, `${first} should exist in en page`);
    assert.ok(en.indexOf(first) < en.indexOf(second), `${first} should appear before ${second}`);
  }
  assert.ok(en.indexOf(enOrder.at(-1)) > -1, "Continue section should exist in en page");
});
