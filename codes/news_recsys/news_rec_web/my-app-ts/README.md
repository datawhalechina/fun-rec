src\react-app-env.d.ts: React项目默认的类型声明文件。
```typescript
/// <reference types="react-scripts" />
```

三斜线指令∶指定依赖的其他类型声明文件，types表示依赖的类型声明文件包的名称。
加载react-scripts这个包提供的类型声明。

react-scripts的类型声明文件包含了两部分类型:
- react、react-dom、node的类型
- 图片、样式等模块的类型，以允许在代码中导入图片、SVG等文件。

TS会自动加载该.d.ts文件，以提供类型声明。


tsconfig.json:配置文件，指定TS的编译选项
项目文件和项目编译所需的配置项
可以自动生成 `tsc --init`
[tsconfig 文档链接](https://www.typescriptlang.org/tsconfig)
```json
{
  // 编译选项
  "compilerOptions": {
    // 生成代码的语言版本
    "target": "es5",
    // 指定要包含在编译中的 library
    "lib": ["dom", "dom.iterable", "esnext"],
    // 允许 ts 编译器编译 js 文件
    "allowJs": true,
    // 跳过声明文件的类型检查
    "skipLibCheck": true,
    // es 模块 互操作，屏蔽 ESModule 和 CommonJS 之间的差异
    "esModuleInterop": true,
    // 允许通过 import x from 'y' 即使模块没有显式指定 default 导出
    "allowSyntheticDefaultImports": true,
    // 开启严格模式
    "strict": true,
    // 对文件名称强制区分大小写
    "forceConsistentCasingInFileNames": true,
    // 为 switch 语句启用错误报告
    "noFallthroughCasesInSwitch": true,
    // 生成代码的模块化标准
    "module": "esnext",
    // 模块解析（查找）策略
    "moduleResolution": "node",
    // 允许导入扩展名为.json的模块
    "resolveJsonModule": true,
    // 是否将没有 import/export 的文件视为旧（全局而非模块化）脚本文件。
    "isolatedModules": true,
    // 编译时不生成任何文件（只进行类型检查）
    "noEmit": true,
    // 指定将 JSX 编译成什么形式
    "jsx": "react-jsx"
  },
  // 指定允许 ts 处理的目录
  "include": ["src"]
}
```