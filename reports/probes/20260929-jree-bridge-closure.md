# Jree 兼容桥收口探查（2026-09-29）

## 当前事实

- 代码提交：`5d8cae9`；本文件只记录探查，不改变生产实现。
- `audit:jree` 的唯一生产直接导入文件是 `src/runtime/jree-compat.ts`，两处导入来自 `jree`。
- 当前桥同时承担四类职责：Java 字符串/CharSequence 输入形状、项目异常与 jree 异常的观察兼容、jree 原型修补（Random、LinkedHashSet、Charset、JavaObject.class）、以及 Node 进程/内存边界。
- 生产调用者仍有约 72 个 `jree-compat` 导入点。高频合同为 `toJavaString`、`javaStringValue`、`JavaStringInput`、`JavaCharSequence`、`JavaString`、`JavaSystemLoggerCompat`、`javaValuesEqual` 和 long 边界；`Nar.ts`、`NarNode.ts`、`Shell.ts`、`TextOutputHandler.ts` 仍直接消费桥导出的 `java` 命名空间。

### 2026-09-29 边界批次 `b094296`

- 新增 `src/platform/node/jree-host-adapter.ts`，将 npm jree 的两处直接导入集中为一个 Node/parity host adapter；`src/runtime/jree-compat.ts` 不再直接导入 npm 包。
- `audit:jree`：直接导入文件仍为 `1`，但直接导入出现次数由 `2` 降为 `1`；新增文件被明确归入 Node host 边界。
- 非增量 typecheck、build、dist API 通过；TS-only M2 为 `494 passed / 0 failed / 2 skipped`，TAP 原始证据：`reports/evidence/jree-host-adapter-ts-m2-20260929.tap`。
- 该批次只完成依赖归属收敛，未宣称 J1、023、024 或浏览器去 jree 完成。

## 结论

不能仅删除两行 `jree` 导入。桥的原型修补仍影响类身份、Random、LinkedHashSet 和 Charset；直接把这些逻辑复制到多个调用者会破坏单一变化源，也无法证明浏览器 Worker 与 Node 仍共享同一合同。阶段门必须保持未完成，直到桥职责被拆成明确的项目内运行时合同，并由宿主适配器承接真正的 jree/Node 依赖。

## 下一次一次性实现批次

1. 新建项目内 `src/runtime/native-string.ts`、`native-values.ts`、`native-exceptions.ts`、`native-host-boundary.ts`，迁移所有不需要 Java 对象实例的函数和类型；生产核心改从这些模块导入。
2. 将 Random、LinkedHashSet、Charset、JavaObject.class 的 jree 原型修补移到显式 Node/Java 兼容宿主适配器；其入口只能由 Node parity/test 装配，核心模块不得导入。
3. 将 `Nar.ts`、`NarNode.ts`、`Shell.ts`、`TextOutputHandler.ts` 中的 `java` 运行时对象消费改为项目内最小接口或 Node/浏览器宿主 adapter；先保留调用形状，再删除命名空间泄漏。
4. 将 `src/runtime/jree-compat.ts` 降级为仅测试/迁移兼容入口，或删除；`package.json` 的 jree 依赖只有在所有生产和浏览器入口不再解析它后才能移除。
5. 在同一批次补直接合同：Java 字符串 UTF-16/hash/compare、异常 `instanceof`、类 token、Random、LinkedHashSet 插入顺序/值判等、Charset 默认值、Node/浏览器能力缺失错误。

## 出口条件

- `audit:jree` 生产直接导入为 `0`，公共 `.d.ts` 不出现 jree 类型；
- 浏览器 bundle 不解析 jree，Node/Java parity 只在宿主 adapter 使用兼容依赖；
- 现有含 Java M2 `496/496`、Node CLI、dist API、浏览器 Worker 和两个 markerless digest 在同一不可变提交上复验；
- 只有上述条件满足后，才通过 LeanSpec 更新 023/024；020 仍保持 in-progress。

## 已有阶段证据，可复用

- strict markerless：`reports/evidence/spec024-markerless-20260929/`，长样本 Java retry 与 TS 比较 `equal=true`；
- 含 Java M2：`reports/evidence/stage-java-m2-final-20260929.tap`，`496/496`；
- 浏览器构建与元数据绑定：web-demo `180924f`，主仓库 `5d8cae9`；
- 阶段计划 JSON：`reports/evidence/stage023-validation-plan-20260929.json`、`stage024-validation-plan-20260929.json`，均 `plan_valid=true`。
