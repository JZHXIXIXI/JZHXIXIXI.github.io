# src/cli

## run-main.ts

### 162:

**tryRunGatewayRunFastPath**：

启动网关



先判断输入、然后并发懒加载，初始化CLI，命令注册，解析执行与异常处理

1.代码首先通过 `isGatewayRunFastPathArgv(argv)` 检查传入的命令行参数是否符合“快速启动”的条件。如果不符合，则直接返回 `false`，交由程序后续的常规流程处理。

2.并发懒加载：一旦确认进入快速路径，代码使用 `Promise.all` 和动态 `import()` 语句并发加载当前命令真正需要的依赖模块（例如 `commander` 命令行库、版本信息、横幅逻辑、日志模块等）。这种按需加载的方式避免了在全局初始化时加载无关代码，极大提升了启动速度。同时，加载过程被包裹在 `startupTrace.measure` 中用于性能监控。

3.CLI初始化：加载完成后，根据策略决定是否打印命令行横幅（Banner）。接着实例化 `commander` 库，将程序命名为 `"openclaw"`，配置基础选项（如 `--no-color`），并重写了默认的错误退出逻辑，防止程序直接抛出异常崩溃。

4.命令注册：通过注入的 `addGatewayRunCommand` 函数，向 CLI 注册了 `gateway` 和它的子命令 `gateway run`。代码中的描述文本明确指出该命令用于“运行、审查和查询 WebSocket 网关”。

5.解析执行与异常处理：最后，调用 `program.parseAsync(argv)` 解析参数并触发对应的命令逻辑。外层的 `try...catch` 块专门用于捕获 `commander` 解析参数失败时抛出的退出事件，优雅地将错误码赋值给 `process.exitCode`，并最终返回 `true` 代表快速启动路径执行完毕。



await startupTrace.measure

并发按需加载（懒加载）与解构赋值



**`argv` (Argument Vector)：** 这是一个包含了用户在命令行敲下的所有单词的数组（也就是“原始输入”）。比如用户在终端敲了 `openclaw gateway run --no-color`，那么 `argv` 里面装的就是这一堆散乱的字符串。

**`resolveCliArgvInvocation(...)`：** 这是一个专门用来“翻译”和“整理”的工具函数。它会接手上面那堆乱糟糟的 `argv` 数组，去掉无关紧要的部分（比如 Node.js 自身的执行路径），精准地提取出用户的**核心意图**。

**`const invocation = ...`：** 把提取出来的核心意图（也就是最终的调用信息）保存到一个叫做 `invocation`（调用/执行）的常量里。



### 733：

```js
if (
      !bootstrapProxyBeforeFastPath &&
      (await tryRunGatewayRunFastPath(normalizedArgv, startupTrace))
    ) {
      return;
    }
```

1.!bootstrapProxyBeforeFastPath

是不是需要在这个阶段提前去启动笨重的代理服务，不需要的话

2.await tryRunGatewayRunFastPath(...)

调用“快速启动网关”函数，将参数（`normalizedArgv`）和计时器（`startupTrace`）传给

函数成功后会return ture





### 800：

const program = await startupTrace.measure("build-program", () => buildProgram());

没有走通前面的“快速通道”，那就走常规慢速路径，把所有的功能都加载并且计时

1. `buildProgram()`（全量构建程序）

- 在前面的“快速路径”里，为了追求极致速度，程序只加载了 `gateway`（网关）这一个命令相关的核心代码。
- 而这里的 `buildProgram()` 函数，顾名思义，就是“构建完整的程序”。它会把这个命令行工具（`openclaw`）底下所有的命令、几百个参数选项、所有的帮助文档和代理服务统统加载进来，组装成一个庞大而完整的骨架。

2. `startupTrace.measure("build-program", ...)`（性能计时）

- 这个你已经很熟悉了！它依然是我们用来性能监控的“秒表”。
- 外层把 `buildProgram()` 的执行过程包裹了起来，并打上了 `"build-program"` 的标签。意思是：“记录一下，这种把所有模块全拉起来的‘重度启动’到底要花多少毫秒。”
- 前面的 `await` 保证了程序会在这里耐心等待，直到这个庞然大物彻底构建完毕。

3. `const program = ...`（保存结果）

- 等漫长的构建和计时都结束后，把构建好的、包含所有完整命令的程序实例，赋值给 `program` 变量，留给下面真正去解析用户的输入并执行。



### 900：

```js
try {
        await startupTrace.measure("parse", () => program.parseAsync(parseArgv));
      } catch (error) {
        if (!isCommanderParseExit(error)) {
          throw error;
        }
        process.exitCode = error.exitCode;
      }
```

全量加载完之后，真正开始解析用户命令，让程序跑起来，但是遇到解析错误，先判断是不是常规的用户输入问题。如果是，就记录并退出，要是底层代码有问题，就直接报错

1. 执行与计时（`try` 块）

- **`program.parseAsync(parseArgv)`**：这里是真正的“发令枪”。程序拿着用户输入的完整参数（`parseArgv`），去刚才构建好的庞大命令库里进行比对，一旦匹配上对应的命令，就开始执行。
- **`startupTrace.measure("parse", ...)`**：依然是我们的性能“秒表”。它负责记录这次全量解析和执行到底花了多少时间。注意这里的标签简明扼要，就叫 `"parse"`（区别于之前快速路径里的 `"gateway-run-parse"`）。

2. 优雅的“安全兜底网”（`catch` 块）

这里完美呼应了我们之前聊过的 `exitOverride`（拦截 `commander` 库的默认自杀行为）的设计：

- 当用户输入了不存在的参数（比如敲了个 `--foo`），或者仅仅是输入了 `--help` 想查看帮助文档时，底层库本来是想直接“强杀”进程退出的，但我们之前把它改成了抛出异常。这里就是**接住异常**的地方。
- **`!isCommanderParseExit(error)`**：这行代码在冷静地分辨：“这到底是个真正的系统 Bug，还是仅仅因为用户敲错了命令？”
- **`throw error`**：如果是真正的系统 Bug（比如读写文件失败、网络断开），绝对不能掩盖，直接抛出去，让外层去打出红色的报错堆栈。
- **`process.exitCode = error.exitCode`**：如果是用户敲错了参数，那就没必要大惊小怪地报一堆代码错误。只需要把错误里的状态码拿出来，悄悄地赋值给系统的 `process.exitCode`，程序就会非常体面、安静地结束。



## src/cli/program/build-program.ts:10

```js
export function buildProgram() {
  const program = new Command();
  program.enablePositionalOptions();
  // Preserve Commander-computed exit codes while still aborting parse flow.
  // Without this, unknown nested commands can print an error
  // but still report success when exits are intercepted.
  program.exitOverride((err) => {
    process.exitCode = typeof err.exitCode === "number" ? err.exitCode : 1;
    throw err;
  });
  const ctx = createProgramContext();
  const argv = process.argv;

  setProgramContext(program, ctx);
  configureProgramHelp(program, ctx);
  registerPreActionHooks(program, ctx.programVersion);

  registerProgramCommands(program, ctx, argv);

  return program;
}
```

初始化基础骨架与异常拦截，绑定并创建全局上下文，配置通用功能与钩子，全量注册所有命令

1.初始化基础骨架与异常拦截

```js
const program = new Command();
program.enablePositionalOptions();
program.exitOverride((err) => { ... });
```

创建了基础的Command实例

//为了在打断解析流程的同时，保留 Commander 计算出的退出码。如果不这么做，当用户输入了未知的嵌套命令时，虽然会打印错误，但因为退出被拦截了，系统可能还会错误地报告执行成功。



2. 创建并绑定全局上下文（Context）

```js
const ctx = createProgramContext();
const argv = process.argv;
setProgramContext(program, ctx);
```

- **`ctx` (Context)**：在大型应用中，通常需要一个“上下文”对象来保存全局的状态、配置信息或数据库连接等。这里创建了一个 `ctx`，并将它绑定到了 `program` 身上，这样后续所有的命令都能共享这些全局信息。
- 同时，提取了 Node.js 底层的原生输入参数 `process.argv` 备用。

3. 配置通用功能与钩子（Hooks）

```js
configureProgramHelp(program, ctx);
registerPreActionHooks(program, ctx.programVersion);
```

- **`configureProgramHelp`**：设置全局的帮助文档（Help）。当用户输入 `--help` 时，那些排版整齐的命令列表和说明，就是由这里配置的。
- **`registerPreActionHooks`**：注册“前置动作钩子”。这类似于给所有的命令加了一个“拦截器”——不管你最终要执行什么命令，在正式执行前，都要先过一遍这些钩子（比如用来检查版本更新、验证权限等）。

4. 全量注册所有命令

```js
registerProgramCommands(program, ctx, argv);
```

**这是最耗时、也是与“快速路径”最大的区别所在。** 之前的快速路径只加载了 `gateway` 这一个命令；而这一行代码，会把这个软件支持的**所有**命令（可能包含启动服务、清理缓存、连接数据库、生成报告等几十个指令）统统注册进去。



## src/cli/program/routes.ts

```js
export function findRoutedCommand(path: string[], argv?: string[]): RouteSpec | null {
  for (const route of routedCommands) {
    if (route.matches(path)) {
      if (argv && route.canRun && !route.canRun(argv)) {
        continue;
      }
      return route;
    }
  }
  return null;
}
```

为了绕过完整的commander注册流程，提供快速路径的路由命令查找功能

决定是否走“快速路径”

拿着用户的输入去查 VIP 名单。它接收两个参数：

- `path: string[]`：用户想执行的核心命令路径（比如 `["gateway", "run"]`）。
- `argv?: string[]`：用户输入的带有各种杂七杂八选项的原始参数列表。



函数内部使用了一个 `for...of` 循环，挨个检查 `routedCommands` 这个名单里的每一项配置：

- **第一步校验路径：`if (route.matches(path))`** 首先看路径对不对得上。如果用户输入的是 `["gateway", "run"]`，刚好这个路由配置就是负责网关的，那就进入下一步。
- **第二步进阶校验：`if (argv && route.canRun && !route.canRun(argv))`** 这是非常严谨的一步。有些命令虽然路径是对的，但如果用户附带了一些非常特殊的参数（`argv`），导致“快速通道”处理不了，那就不行。 这里的逻辑是：“如果用户传了参数，并且这个路由配置里有 `canRun`（能否运行）的检查规则，**但检查没通过**（前面有个 `!`），那就 `continue`（跳过当前这个，继续去名单里找下一个）。”
- **成功匹配：`return route;`** 如果路径匹配上了，并且参数检查也通过了，那就直接返回这个路由配置信息。这就等于告诉系统：“检查完毕，这位客人可以走 VIP 快速通道！”
- **无功而返：`return null;`** 如果把整个名单都翻遍了也没找到匹配的，或者虽然路径对上了但参数太复杂处理不了，最后就会返回 `null`。这就等于告诉系统：“抱歉，查无此人/无法走捷径，请老老实实去排队（走全量加载的 `buildProgram` 慢速流程）吧。”



## src/cli/program/command-tree.ts

```js
// Commander tree mutation helpers used by lazy command replacement.
import type { Command } from "commander";

/** Remove an exact Command instance from a parent program. */
export function removeCommand(program: Command, command: Command): boolean {
  const commands = program.commands as Command[];
  const index = commands.indexOf(command);
  if (index < 0) {
    return false;
  }
  commands.splice(index, 1);
  return true;
}

/** Remove a command by primary name or alias. */
export function removeCommandByName(program: Command, name: string): boolean {
  const existing = program.commands.find(
    (command) => command.name() === name || command.aliases().includes(name),
  );
  if (!existing) {
    return false;
  }
  return removeCommand(program, existing);
}

```

展示了两个辅助函数

1. 两个删除函数的作用

- **`removeCommand`（精准拔除）：** 它接收主程序（`program`）和一个**具体的命令对象**（`command`）。它会去主程序的命令列表里翻找，如果找到了这个确切的对象，就用 `splice` 方法把它从数组里踢出去。这就像是你指着工具箱里的某一把特定扳手说：“把这把扔掉”。
- **`removeCommandByName`（按名字/别名拔除）：** 它接收主程序（`program`）和一个**字符串名字**（`name`）。它会遍历所有命令，检查命令的正规名称（`name()`）或者它的缩写别名（`aliases()`）有没有匹配的。一旦找到，就调用上面那个 `removeCommand` 函数把它删掉。这就像是你说：“把工具箱里那个叫‘十字螺丝刀’的家伙拿走”。

2. 为什么需要“删除”命令？（结合上下文）

你可能会好奇，之前我们一直在辛苦地“注册”命令（`addGatewayRunCommand`），为什么现在又要写代码去“删除”它们呢？

这就是注释里说的 **`lazy command replacement`（懒加载命令替换）** 的高明之处： 在极大型的命令行工具中，为了让 `openclaw --help`（查看帮助文档）显示得非常快，程序一开始可能只给所有的复杂命令注册了一个**轻量级的“空壳”（或者叫占位符）**。

当用户真的敲下某个需要执行复杂任务的指令时，系统会瞬间触发这两个函数，**把那个轻量的“空壳”删掉，然后立刻动态加载出真正的、完整的“重装版”命令替换上去，并继续执行。**



3. `removeCommand`（精准打击：通过“对象本身”删除）

这个函数的作用是**删除一个你已经拿在手里的、具体的命令对象**。

- **接收参数**：它需要知道“主程序”（`program`，也就是那面工具墙）和“具体的命令对象”（`command`，也就是你要摘的那个特定扳手）。
- **执行逻辑**：
  1. 拿到主程序身上挂着的所有命令列表（`program.commands`）。
  2. 使用 `indexOf` 去这个列表里找：“你要删的这个对象，排在第几个位置（索引）？”
  3. 如果没找到（索引 `< 0`），说明墙上本来就没有这个东西，直接返回 `false`（删除失败）。
  4. 如果找到了，就用 JavaScript 数组的 `splice` 方法，精准地把这个位置上的命令“剪裁”掉。
  5. 最后返回 `true`，报告删除成功。



4. `removeCommandByName`（按图索骥：通过“名字或别名”删除）

这个函数的作用是**只凭一个字符串名字，去把对应的命令找出来并删掉**。它其实是上面那个函数的“前置搜索加强版”。

- **接收参数**：它需要知道“主程序”（`program`）和你想删除的命令的“名字”（`name`字符串）。
- **执行逻辑**：
  1. 使用数组的 `find` 方法去遍历主程序里的所有命令。
  2. **查找条件非常严谨**：它不仅核对命令的正规名字（`command.name() === name`），还会核对这个命令是不是有缩写别名（`command.aliases().includes(name)`）。比如，不管你输入的是 `gateway` 还是缩写 `gw`，只要对上了就能揪出来。
  3. 如果把整个列表翻遍了都没找到（`!existing`），就返回 `false`。
  4. **精妙的复用**：如果找到了这个命令对象，它不会自己去写删除逻辑，而是**直接调用上面的 `removeCommand` 函数**，把刚找到的对象传过去执行真正的删除动作（`return removeCommand(program, existing)`）。



### src/cli/program/command-registry.ts

```js
// Program command registry facade: exports core descriptors and registers core plus sub-CLIs.
import type { Command } from "commander";
import {
  getCoreCliCommandDescriptors,
  getCoreCliCommandNames,
  getCoreCliCommandsWithSubcommands,
  type CommandRegistration,
  registerCoreCliByName,
  registerCoreCliCommands,
} from "./command-registry-core.js";
import type { ProgramContext } from "./context.js";
import { registerSubCliCommands } from "./register.subclis.js";

export {
  getCoreCliCommandDescriptors,
  getCoreCliCommandNames,
  getCoreCliCommandsWithSubcommands,
  registerCoreCliByName,
  registerCoreCliCommands,
};

/** Core command registration contract re-exported for program builders and tests. */
export type { CommandRegistration };

/** Register all root-program commands for the current argv shape. */
export function registerProgramCommands(
  program: Command,
  ctx: ProgramContext,
  argv: string[] = process.argv,
) {
  registerCoreCliCommands(program, ctx, argv);
  registerSubCliCommands(program, argv);
}

```

1. 作为一个“中转站”或“橱窗”（Re-exports）

代码的前半部分（第 2 行到第 23 行）全都是 `import` 和 `export`。 它从系统深处的不同文件（比如 `./command-registry-core.js`）里把各种核心函数提取出来，然后重新打包统一暴露出去。 这就好比一个大型超市的“总服务台”，其他模块不需要去满仓库乱找，只要来到这个服务台，就能拿到所有和“注册命令”相关的工具（比如获取命令名称、获取注册契约等）。

2. 核心大招：`registerProgramCommands` 的具体实现

在代码的底部（第 26 到 33 行），我们终于看到了这个函数的内部长什么样。令人惊讶的是，它里面非常简单，只有两行代码！

原来，所谓的“全量注册所有命令”，是分两步走的：

- **第一步：`registerCoreCliCommands(program, ctx, argv);`** 注册**核心命令**。这是 CLI 工具自带的、最基础的自带指令（比如底层的配置、更新、基础的网关占位符等）。
- **第二步：`registerSubCliCommands(program, argv);`** 注册**子命令行（Sub-CLIs）**。对于一个大型、可扩展的系统来说，它可能允许挂载各种插件或者外围模块。这行代码就是把那些非核心的、额外的命令统统组装到主程序上。



## src/cli/program/register.setup.ts

```js
// Setup command registration: baseline setup by default, onboarding wizard when wizard flags appear.
import type { Command } from "commander";
import { formatDocsLink } from "../../../packages/terminal-core/src/links.js";
import { theme } from "../../../packages/terminal-core/src/theme.js";
import { runCommandWithRuntime } from "../cli-utils.js";
import { hasExplicitOptions } from "../command-options.js";

/** Register the `setup` command and route wizard-style invocations to onboarding. */
export function registerSetupCommand(program: Command): void {
  program
    .command("setup")
    .description("Create baseline config/workspace files; use --wizard for full onboarding")
    .addHelpText(
      "after",
      () =>
        `\n${theme.heading("Examples:")}\n` +
        `  ${theme.command("openclaw setup")}\n` +
        `    ${theme.muted("Create config, workspace, and session folders.")}\n` +
        `  ${theme.command("openclaw setup --wizard")}\n` +
        `    ${theme.muted("Run full onboarding for auth, models, Gateway, and channels.")}\n\n` +
        `${theme.muted("Docs:")} ${formatDocsLink("/cli/setup", "docs.openclaw.ai/cli/setup")}\n`,
    )
    .option(
      "--workspace <dir>",
      "Agent workspace directory (default: ~/.openclaw/workspace; stored as agents.defaults.workspace)",
    )
    .option("--wizard", "Run interactive onboarding", false)
    .option("--non-interactive", "Run onboarding without prompts", false)
    .option(
      "--accept-risk",
      "Acknowledge that agents are powerful and full system access is risky (required for --non-interactive)",
      false,
    )
    .option("--mode <mode>", "Onboard mode: local|remote")
    .option("--import-from <provider>", "Migration provider to run during onboarding")
    .option("--import-source <path>", "Source agent home for --import-from")
    .option("--import-secrets", "Import supported secrets during onboarding migration", false)
    .option("--remote-url <url>", "Remote Gateway WebSocket URL")
    .option("--remote-token <token>", "Remote Gateway token (optional)")
    .action(async (opts, command) => {
      const { defaultRuntime } = await import("../../runtime.js");
      await runCommandWithRuntime(defaultRuntime, async () => {
        const hasWizardFlags = hasExplicitOptions(command, [
          "wizard",
          "nonInteractive",
          "acceptRisk",
          "mode",
          "importFrom",
          "importSource",
          "importSecrets",
          "remoteUrl",
          "remoteToken",
        ]);
        // Any onboarding-only flag means the user intended the wizard path even without --wizard.
        if (opts.wizard || hasWizardFlags) {
          const { setupWizardCommand } = await import("../../commands/onboard.js");
          await setupWizardCommand(
            {
              workspace: opts.workspace as string | undefined,
              nonInteractive: Boolean(opts.nonInteractive),
              acceptRisk: Boolean(opts.acceptRisk),
              mode: opts.mode as "local" | "remote" | undefined,
              importFrom: opts.importFrom as string | undefined,
              importSource: opts.importSource as string | undefined,
              importSecrets: Boolean(opts.importSecrets),
              remoteUrl: opts.remoteUrl as string | undefined,
              remoteToken: opts.remoteToken as string | undefined,
            },
            defaultRuntime,
          );
          return;
        }
        const { setupCommand } = await import("../../commands/setup.js");
        await setupCommand({ workspace: opts.workspace as string | undefined }, defaultRuntime);
      });
    });
}

```

1. 打造漂亮的“帮助说明书” (`.description` & `.addHelpText`)

代码的前半部分定义了当用户输入 `openclaw setup --help` 时会看到什么。 除了基础的描述外，它还用 `.addHelpText("after", ...)` 在帮助文档底部追加了非常详细的**使用示例**和**官方文档链接**。并且，它还调用了顶部的 `theme` 工具，这意味着这些帮助信息在终端里打印出来时是**带颜色、有高亮排版**的，非常注重用户体验。

2. 注册丰富的参数选项 (`.option`)

接着，它为这个命令挂载了一大堆选项。比如：

- 指定工作目录（`--workspace`）
- 开启向导模式（`--wizard`）
- 静默执行不弹提示（`--non-interactive`）
- 甚至还有硬核的安全确认（`--accept-risk`，因为系统权限较高） 这些参数让这个命令变得非常灵活。

3. “智能分发”的核心业务逻辑 (`.action`)

这是这段代码最核心、最聪明的地方。当用户敲下回车后，`.action` 里面的代码开始执行：

- **`hasWizardFlags` 的侦测：** 程序会先扫一眼用户输入的参数。它不仅检查用户有没有直接输入 `--wizard`，还会检查用户是不是输入了其他只属于向导模式的专属参数（比如 `--mode`、`--import-from`）。只要沾了一点边，程序就会非常智能地判定：“**用户其实是想跑完整的向导流程。**”
- **分支 A（全套向导流程）：** 如果判定用户需要向导，它就会走 `if` 里面的逻辑。把用户输入的所有参数打包好，传给专门负责复杂交互的 `setupWizardCommand`去执行（比如验证权限、连接网关、下载模型等）。
- **分支 B（极简静默流程）：** 如果用户什么向导参数都没带（只是敲了 `openclaw setup`），它就跳过 `if`，走到最后，只执行一个非常轻量级的基础配置任务（比如仅仅在电脑上建几个空文件夹）。

4. 贯彻到底的“极致懒加载”

如果你仔细看第 41、56、73 行，你会发现又出现了大量的 **`await import(...)` 动态导入**！

- 哪怕用户运行了 `setup` 命令，系统也不会一开始就把“重度向导”和“轻量配置”的代码全加载进来。
- 只有当“智能分发”逻辑确定了要走哪条路之后，它**才会在那一瞬间去现场加载对应的业务文件**（`onboard.js` 或 `setup.js`）。



## register.onboard.ts

```js
// Commander registration for onboard setup flags and lazy onboard runtime execution.
import type { Command } from "commander";
import { formatDocsLink } from "../../../packages/terminal-core/src/links.js";
import { theme } from "../../../packages/terminal-core/src/theme.js";
import { formatAuthChoiceChoicesForCli } from "../../commands/auth-choice-options.js";
import type { GatewayDaemonRuntime } from "../../commands/daemon-runtime.js";
import { CORE_ONBOARD_AUTH_FLAGS } from "../../commands/onboard-core-auth-flags.js";
import type {
  AuthChoice,
  GatewayAuthChoice,
  GatewayBind,
  NodeManagerChoice,
  ResetScope,
  SecretInputMode,
  TailscaleMode,
} from "../../commands/onboard-types.js";
import { resolveManifestProviderOnboardAuthFlags } from "../../plugins/provider-auth-choices.js";
import { runCommandWithRuntime } from "../cli-utils.js";
import { parsePort } from "../shared/parse-port.js";

function resolveInstallDaemonFlag(
  command: unknown,
  opts: { installDaemon?: boolean },
): boolean | undefined {
  if (!command || typeof command !== "object") {
    return undefined;
  }
  const getOptionValueSource =
    "getOptionValueSource" in command ? command.getOptionValueSource : undefined;
  if (typeof getOptionValueSource !== "function") {
    return undefined;
  }

  // Commander doesn't support option conflicts natively; keep original behavior.
  // If --skip-daemon is explicitly passed, it wins.
  if (getOptionValueSource.call(command, "skipDaemon") === "cli") {
    return false;
  }
  if (getOptionValueSource.call(command, "installDaemon") === "cli") {
    return Boolean(opts.installDaemon);
  }
  return undefined;
}

const AUTH_CHOICE_HELP = formatAuthChoiceChoicesForCli({
  includeLegacyAliases: true,
  includeSkip: true,
});

type OnboardAuthFlag = {
  readonly cliOption: string;
  readonly description: string;
  readonly optionKey: string;
};

function extractCliFlags(cliOption: string): string[] {
  return cliOption
    .split(/[ ,|]+/)
    .filter((part) => part.startsWith("-"))
    .map((part) => {
      const equalsIndex = part.indexOf("=");
      return equalsIndex === -1 ? part : part.slice(0, equalsIndex);
    });
}

function resolveOnboardAuthFlags(): OnboardAuthFlag[] {
  // Provider manifests can add auth flags; keep duplicate CLI aliases out of Commander.
  const seenCliFlags = new Set<string>();
  const flags: OnboardAuthFlag[] = [];
  for (const flag of [...CORE_ONBOARD_AUTH_FLAGS, ...resolveManifestProviderOnboardAuthFlags()]) {
    const cliFlags = extractCliFlags(flag.cliOption);
    if (cliFlags.some((cliFlag) => seenCliFlags.has(cliFlag))) {
      continue;
    }
    for (const cliFlag of cliFlags) {
      seenCliFlags.add(cliFlag);
    }
    flags.push(flag);
  }
  return flags;
}

const ONBOARD_AUTH_FLAGS = resolveOnboardAuthFlags();

function pickOnboardProviderAuthOptionValues(
  opts: Record<string, unknown>,
): Partial<Record<string, string | undefined>> {
  return Object.fromEntries(
    ONBOARD_AUTH_FLAGS.map((flag) => [flag.optionKey, opts[flag.optionKey] as string | undefined]),
  );
}

export function registerOnboardCommand(program: Command): void {
  const command = program
    .command("onboard")
    .description("Guided setup for auth, models, Gateway, workspace, channels, and skills")
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/onboard", "docs.openclaw.ai/cli/onboard")}\n`,
    )
    .option("--workspace <dir>", "Agent workspace directory (default: ~/.openclaw/workspace)")
    .option(
      "--reset",
      "Reset config + credentials + sessions before running onboard (workspace only with --reset-scope full)",
    )
    .option("--reset-scope <scope>", "Reset scope: config|config+creds+sessions|full")
    .option("--non-interactive", "Run without prompts", false)
    .option("--modern", "Use the conversational setup/repair assistant", false)
    .option(
      "--accept-risk",
      "Acknowledge that agents are powerful and full system access is risky (required for --non-interactive)",
      false,
    )
    .option("--flow <flow>", "Onboard flow: quickstart|advanced|manual|import")
    .option("--mode <mode>", "Onboard mode: local|remote")
    .option("--auth-choice <choice>", `Auth: ${AUTH_CHOICE_HELP}`)
    .option(
      "--token-provider <id>",
      "Token provider id (non-interactive; used with --auth-choice token)",
    )
    .option("--token <token>", "Token value (non-interactive; used with --auth-choice token)")
    .option(
      "--token-profile-id <id>",
      "Auth profile id (non-interactive; default: <provider>:manual)",
    )
    .option("--token-expires-in <duration>", "Optional token expiry duration (e.g. 365d, 12h)")
    .option(
      "--secret-input-mode <mode>",
      "API key persistence mode: plaintext|ref (default: plaintext)",
    )
    .option("--cloudflare-ai-gateway-account-id <id>", "Cloudflare Account ID")
    .option("--cloudflare-ai-gateway-gateway-id <id>", "Cloudflare AI Gateway ID");

  for (const providerFlag of ONBOARD_AUTH_FLAGS) {
    command.option(providerFlag.cliOption, providerFlag.description);
  }

  command
    .option("--custom-base-url <url>", "Custom provider base URL")
    .option("--custom-api-key <key>", "Custom provider API key (optional)")
    .option("--custom-model-id <id>", "Custom provider model ID")
    .option("--custom-provider-id <id>", "Custom provider ID (optional; auto-derived by default)")
    .option(
      "--custom-compatibility <mode>",
      "Custom provider API compatibility: openai|openai-responses|anthropic (default: openai)",
    )
    .option("--custom-image-input", "Mark the custom provider model as image-capable")
    .option("--custom-text-input", "Mark the custom provider model as text-only")
    .option("--gateway-port <port>", "Gateway port")
    .option("--gateway-bind <mode>", "Gateway bind: loopback|tailnet|lan|auto|custom")
    .option("--gateway-auth <mode>", "Gateway auth: token|password")
    .option("--gateway-token <token>", "Gateway token (token auth)")
    .option(
      "--gateway-token-ref-env <name>",
      "Gateway token SecretRef env var name (token auth; e.g. OPENCLAW_GATEWAY_TOKEN)",
    )
    .option("--gateway-password <password>", "Gateway password (password auth)")
    .option("--remote-url <url>", "Remote Gateway WebSocket URL")
    .option("--remote-token <token>", "Remote Gateway token (optional)")
    .option("--tailscale <mode>", "Tailscale: off|serve|funnel")
    .option("--tailscale-reset-on-exit", "Reset tailscale serve/funnel on exit")
    .option("--install-daemon", "Install gateway service")
    .option("--no-install-daemon", "Skip gateway service install")
    .option("--skip-daemon", "Skip gateway service install")
    .option("--daemon-runtime <runtime>", "Daemon runtime: node|bun")
    .option("--skip-channels", "Skip channel setup")
    .option("--skip-skills", "Skip skills setup")
    .option("--skip-bootstrap", "Skip creating default agent workspace files")
    .option("--skip-search", "Skip search provider setup")
    .option("--skip-health", "Skip health check")
    .option("--skip-ui", "Skip Control UI/TUI prompts")
    .option("--suppress-gateway-token-output", "Suppress token-bearing Gateway/UI output")
    .option("--skip-hooks", "Skip hook setup")
    .option("--node-manager <name>", "Node manager for skills: npm|pnpm|bun")
    .option("--import-from <provider>", "Migration provider to run during onboarding")
    .option("--import-source <path>", "Source agent home for --import-from")
    .option("--import-secrets", "Import supported secrets during onboarding migration", false)
    .option("--json", "Output JSON summary", false);

  command.action(async (opts, commandRuntime) => {
    const { defaultRuntime } = await import("../../runtime.js");
    await runCommandWithRuntime(defaultRuntime, async () => {
      if (opts.modern) {
        const { runCrestodian } = await import("../../crestodian/crestodian.js");
        await runCrestodian({
          message: opts.nonInteractive ? "overview" : undefined,
          yes: false,
          json: Boolean(opts.json),
          interactive: !opts.nonInteractive,
        });
        return;
      }
      const installDaemon = resolveInstallDaemonFlag(commandRuntime, {
        installDaemon: Boolean(opts.installDaemon),
      });
      const gatewayPort = parsePort(opts.gatewayPort);
      const providerAuthOptionValues = pickOnboardProviderAuthOptionValues(
        opts as Record<string, unknown>,
      );
      const { setupWizardCommand } = await import("../../commands/onboard.js");
      await setupWizardCommand(
        {
          workspace: opts.workspace as string | undefined,
          nonInteractive: Boolean(opts.nonInteractive),
          acceptRisk: Boolean(opts.acceptRisk),
          flow: opts.flow as "quickstart" | "advanced" | "manual" | "import" | undefined,
          mode: opts.mode as "local" | "remote" | undefined,
          authChoice: opts.authChoice as AuthChoice | undefined,
          tokenProvider: opts.tokenProvider as string | undefined,
          token: opts.token as string | undefined,
          tokenProfileId: opts.tokenProfileId as string | undefined,
          tokenExpiresIn: opts.tokenExpiresIn as string | undefined,
          secretInputMode: opts.secretInputMode as SecretInputMode | undefined,
          ...providerAuthOptionValues,
          cloudflareAiGatewayAccountId: opts.cloudflareAiGatewayAccountId as string | undefined,
          cloudflareAiGatewayGatewayId: opts.cloudflareAiGatewayGatewayId as string | undefined,
          customBaseUrl: opts.customBaseUrl as string | undefined,
          customApiKey: opts.customApiKey as string | undefined,
          customModelId: opts.customModelId as string | undefined,
          customProviderId: opts.customProviderId as string | undefined,
          customCompatibility: opts.customCompatibility as
            | "openai"
            | "openai-responses"
            | "anthropic"
            | undefined,
          customImageInput:
            opts.customTextInput === true
              ? false
              : opts.customImageInput === true
                ? true
                : undefined,
          gatewayPort: gatewayPort ?? undefined,
          gatewayBind: opts.gatewayBind as GatewayBind | undefined,
          gatewayAuth: opts.gatewayAuth as GatewayAuthChoice | undefined,
          gatewayToken: opts.gatewayToken as string | undefined,
          gatewayTokenRefEnv: opts.gatewayTokenRefEnv as string | undefined,
          gatewayPassword: opts.gatewayPassword as string | undefined,
          remoteUrl: opts.remoteUrl as string | undefined,
          remoteToken: opts.remoteToken as string | undefined,
          tailscale: opts.tailscale as TailscaleMode | undefined,
          tailscaleResetOnExit: Boolean(opts.tailscaleResetOnExit),
          reset: Boolean(opts.reset),
          resetScope: opts.resetScope as ResetScope | undefined,
          installDaemon,
          daemonRuntime: opts.daemonRuntime as GatewayDaemonRuntime | undefined,
          skipChannels: Boolean(opts.skipChannels),
          skipSkills: Boolean(opts.skipSkills),
          skipBootstrap: Boolean(opts.skipBootstrap),
          skipSearch: Boolean(opts.skipSearch),
          skipHealth: Boolean(opts.skipHealth),
          skipUi: Boolean(opts.skipUi),
          suppressGatewayTokenOutput: Boolean(opts.suppressGatewayTokenOutput),
          skipHooks: Boolean(opts.skipHooks),
          nodeManager: opts.nodeManager as NodeManagerChoice | undefined,
          importFrom: opts.importFrom as string | undefined,
          importSource: opts.importSource as string | undefined,
          importSecrets: Boolean(opts.importSecrets),
          json: Boolean(opts.json),
        },
        defaultRuntime,
      );
    });
  });
}

```

这段代码的核心任务是**注册并配置 `openclaw onboard` 命令**。这是一个极其重量级的向导流程，负责把整个系统的骨架搭起来。

1. `resolveInstallDaemonFlag`（冲突调解员）

**作用：** 专门解决 `--install-daemon` 和 `--skip-daemon` 这两个互相矛盾的参数冲突。 **代码逻辑：** 由于底层的 `commander` 命令行库默认不支持“互斥选项”（即不能同时输入两个相反的命令），所以这个函数用了一个很极客的方法：

- 它深入到底层，调用 `getOptionValueSource` 来判断：这个参数到底是因为系统默认给的，还是**用户自己在键盘上手敲的（`==="cli"`）**？
- 如果用户明确手敲了 `--skip-daemon`，那就听用户的，返回 `false`（不安装）。
- 如果用户手敲了 `--install-daemon`，同样听用户的。
- 这个函数极其严谨地保证了**用户的直接意图拥有最高优先级**，防止程序因为默认值而出错。

2. `extractCliFlags`（参数清洗工）

**作用：** 把复杂的参数定义字符串，拆解成干净的数组。 **代码逻辑：** 在写命令行程序时，我们通常会这样定义参数：`-w, --workspace <dir>|--work`（有简写、有全拼、有变量名）。

- 这个函数使用正则表达式 `/[ ,|]+/` 把这个长字符串按空格、逗号或竖线切开。
- 过滤掉不带 `-` 的干扰项（比如 `<dir>`）。
- 去掉等号后面的内容。
- 最终输出一个干净的数组：`['-w', '--workspace', '--work']`。它是为了给下一个函数做查重准备的。

3. `resolveOnboardAuthFlags`（防撞车安检员）

**作用：** 动态收集所有插件的参数，并防止它们名字冲突（去重）。 **代码逻辑：** 因为这个工具支持接入多种大模型（比如 OpenAI, Anthropic 等等），每个模型插件可能都有自己的认证参数（比如都需要叫 `--api-key`）。如果直接全部塞进程序里，程序会因为参数名重复而崩溃。

- 这个函数会遍历所有核心参数和插件带来的参数。
- 它内部维护了一个 `seenCliFlags`（已见过的参数黑名单）。
- 在录入新参数前，它会先让上一个清洗工（`extractCliFlags`）把新参数拆开，然后查一遍黑名单。如果发现这个名字已经被其他插件占用了，就直接 `continue`（跳过），确保注册到命令行里的参数绝对不重名。

4. `pickOnboardProviderAuthOptionValues`（专属打包员）

**作用：** 从用户输入的几百个乱七八糟的配置里，精准地只把“身份认证（Auth）”相关的参数挑出来。 **代码逻辑：** 当用户敲完一长串命令按回车后，系统会得到一个巨大的 `opts` 对象。 这个函数会对照着上一个安检员整理好的“认证参数白名单”（`ONBOARD_AUTH_FLAGS`），把 `opts` 里对应的认证信息（比如各种 token、密钥）单独挑出来，打包成一个小小的对象（`Partial<Record<...>>`），方便后续安全地传给底层业务去连接大模型。

5. `registerOnboardCommand`（大管家 / 总装车间）

**作用：** 这是这个文件里最大的函数，也是唯一的对外出口（`export`）。它把前面所有的准备工作拼装在一起，正式向系统注册 `onboard` 这个命令。 **代码逻辑：**

- **组装面板：** 连续调用几十次 `.option()`，把各种端口、网络、模式的参数选项挂载到命令上。
- **挂载动态参数：** 用一个 `for` 循环（第 137 行），把前面“安检员”去重后的认证参数也挂载上去。
- **定义行为 (`.action`)：** 设定当用户按下回车时该干嘛。这部分就是我们上一个回答里重点分析的：它会判断是不是 `--modern`（现代对话模式），调用“冲突调解员”处理 Daemon 参数，调用“专属打包员”整理好 Auth 参数，最后懒加载（`await import`）出真正的配置逻辑文件去干活。





## register.configure.ts

```js
// Configure command registration: lazy-loads the interactive configuration wizard.
import type { Command } from "commander";
import { formatDocsLink } from "../../../packages/terminal-core/src/links.js";
import { theme } from "../../../packages/terminal-core/src/theme.js";
import { CONFIGURE_WIZARD_SECTIONS } from "../../commands/configure.shared.js";
import { runCommandWithRuntime } from "../cli-utils.js";

/** Register the interactive `configure` command and section filter flag. */
export function registerConfigureCommand(program: Command): void {
  program
    .command("configure")
    .description("Interactive configuration for credentials, channels, gateway, and agent defaults")
    .addHelpText(
      "after",
      () =>
        `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/configure", "docs.openclaw.ai/cli/configure")}\n`,
    )
    .option(
      "--section <section>",
      `Configuration sections (repeatable). Options: ${CONFIGURE_WIZARD_SECTIONS.join(", ")}`,
      (value: string, previous: string[]) => [...previous, value],
      [] as string[],
    )
    .action(async (opts) => {
      const { defaultRuntime } = await import("../../runtime.js");
      await runCommandWithRuntime(defaultRuntime, async () => {
        const { configureCommandFromSectionsArg } =
          await import("../../commands/configure.commands.js");
        await configureCommandFromSectionsArg(opts.section, defaultRuntime);
      });
    });
}

```



1. 提供专属的“配置入口”

代码开头通过 `.command("configure")` 注册了命令，并附上了说明：“用于凭证、通道、网关和代理默认值的交互式配置”。和前面一样，它也在帮助文档底部贴心地附上了带颜色的官方文档链接。

2. 精准的“按需过滤”（`--section` 参数）

这是这个命令最核心的设计：

- **`.option("--section <section>", ...)`**：它允许用户通过参数**挑选**自己想配置的部分。
- **重复参数收集（高级用法）：** 你注意到这行代码了吗？`(value: string, previous: string[]) => [...previous, value], [] as string[]`。 它的意思是：允许用户在命令行里**多次输入同一个参数**。比如用户可以输入 `openclaw configure --section auth --section gateway`。系统会把所有的值收集到一个数组 `['auth', 'gateway']` 里。
- 这非常适合那些“老手”——他们不需要重新跑一遍全套向导，只想快速进去修改某几个特定的配置模块。

3. 极简的“双重懒加载”执行（`.action`）

当用户敲击回车后，它的执行逻辑非常干净利落，并且把“按需加载”做到了极致：

- **第一层加载：** 先动态 `import` 底层运行环境（`runtime.js`）。
- **第二层加载：** 再动态 `import` 真正负责画交互界面的向导逻辑（`configure.commands.js`）。
- 最后，把用户挑选的“模块数组”（`opts.section`）传给那个向导，让它只展示用户想修改的那几页。



## register.message.ts

```js
// Message command registration: core send/read/manage actions plus channel-specific admin helpers.
import type { Command } from "commander";
import { formatDocsLink } from "../../../packages/terminal-core/src/links.js";
import { theme } from "../../../packages/terminal-core/src/theme.js";
import { formatHelpExamples } from "../help-format.js";
import type { ProgramContext } from "./context.js";
import { createMessageCliHelpers } from "./message/helpers.js";
import { registerMessageBroadcastCommand } from "./message/register.broadcast.js";
import { registerMessageDiscordAdminCommands } from "./message/register.discord-admin.js";
import {
  registerMessageEmojiCommands,
  registerMessageStickerCommands,
} from "./message/register.emoji-sticker.js";
import {
  registerMessagePermissionsCommand,
  registerMessageSearchCommand,
} from "./message/register.permissions-search.js";
import { registerMessagePinCommands } from "./message/register.pins.js";
import { registerMessagePollCommand } from "./message/register.poll.js";
import { registerMessageReactionsCommands } from "./message/register.reactions.js";
import { registerMessageReadEditDeleteCommands } from "./message/register.read-edit-delete.js";
import { registerMessageSendCommand } from "./message/register.send.js";
import { registerMessageThreadCommands } from "./message/register.thread.js";

/** Register the `message` command group with shared channel option helpers. */
export function registerMessageCommands(program: Command, ctx: ProgramContext) {
  const message = program
    .command("message")
    .description("Send, read, and manage messages and channel actions")
    .addHelpText(
      "after",
      () =>
        `
${theme.heading("Examples:")}
${formatHelpExamples([
  ['openclaw message send --target +15555550123 --message "Hi"', "Send a text message."],
  [
    'openclaw message send --target +15555550123 --message "Hi" --media photo.jpg',
    "Send a message with media.",
  ],
  [
    'openclaw message poll --channel discord --target channel:123 --poll-question "Snack?" --poll-option Pizza --poll-option Sushi',
    "Create a Discord poll.",
  ],
  [
    'openclaw message react --channel discord --target 123 --message-id 456 --emoji "✅"',
    "React to a message.",
  ],
])}

${theme.muted("Docs:")} ${formatDocsLink("/cli/message", "docs.openclaw.ai/cli/message")}`,
    )
    .action(() => {
      message.help({ error: true });
    });

  const helpers = createMessageCliHelpers(message, ctx.messageChannelOptions);
  registerMessageSendCommand(message, helpers);
  registerMessageBroadcastCommand(message, helpers);
  registerMessagePollCommand(message, helpers);
  registerMessageReactionsCommands(message, helpers);
  registerMessageReadEditDeleteCommands(message, helpers);
  registerMessagePinCommands(message, helpers);
  registerMessagePermissionsCommand(message, helpers);
  registerMessageSearchCommand(message, helpers);
  registerMessageThreadCommands(message, helpers);
  registerMessageEmojiCommands(message, helpers);
  registerMessageStickerCommands(message, helpers);
  registerMessageDiscordAdminCommands(message, helpers);
}

```

这段代码注册了 `openclaw message` 这个核心主命令，并把它变成了一个“消息控制中心”，用来统一管理发送、读取、撤回消息以及各种平台（如 Discord、短信等）的互动功能。

1. 打造清晰的入口与“使用说明书”

JavaScript

```
const message = program.command("message").description("...").addHelpText("after", ...)
```

这段代码首先创建了 `message` 这个一级命令，并给它加上了非常详尽的帮助文档。 它利用了之前提到的 `theme`（主题排版工具）和 `formatHelpExamples`，直接在终端里为用户展示了四个非常实用的例子：

- 怎么发纯文本短信。
- 怎么带图片发消息。
- 怎么在 Discord 频道里发起一个“披萨还是寿司”的投票（Poll）。
- 怎么给特定消息点个“✅”的表情包（React）。 这极大降低了用户的学习成本。

2. 贴心的“防呆”兜底机制

JavaScript

```
.action(() => {
  message.help({ error: true });
});
```

这是一个非常经典的 CLI 设计细节。 因为 `message` 是一个“父命令”，它本身不执行任何具体动作，真正干活的是它的“子命令”（比如 `message send`）。 如果用户是个新手，只敲了一个 `openclaw message` 就按了回车，这段代码会立刻捕捉到，并自动把刚才那份排版精美的帮助文档打印出来提醒用户（同时返回一个 error 状态码），而不是让程序傻傻地卡在那里。

3. 提取公共的“工具腰带”

JavaScript

```
const helpers = createMessageCliHelpers(message, ctx.messageChannelOptions);
```

既然这是一个支持多渠道（短信、Discord 等）的消息工具，那么它的几十个子命令肯定都需要用到诸如 `--channel`（指定渠道）或 `--target`（指定目标联系人/群组）这样的通用参数。 这个 `createMessageCliHelpers` 就是把这些通用的选项打包成了一个“工具腰带”，方便后面发给每一个子命令使用，避免了代码的重复编写。

4. 极致的“模块化”拆分（化整为零）

在代码的最下面，你看到了一长串的 `registerMessageXxxCommand(message, helpers);` 调用。 这也是这段代码最核心的架构思想：**分而治之**。 开发者没有把发送消息、删消息、发投票、置顶（Pin）、权限管理、表情包等几千行逻辑全塞在这一个文件里。相反，他们：

1. 把每一个具体的子功能写在了独立的文件夹和文件里（看顶部的 `import` 列表）。
2. 在这个主文件里，只负责把 `message` 父命令和 `helpers` 工具包递给这些注册函数。
3. 让那些独立的函数自己去把子命令“挂载”到 `message` 身上。