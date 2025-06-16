declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
// ```
// **代码解释**：
// * `declare module '*.vue'`：这行代码是在告诉 TypeScript，我们要为所有以 `.vue` 结尾的模块（` *.vue`）提供一个类型声明。
// * `import type { DefineComponent } from 'vue'`：我们从 `vue` 中导入 `DefineComponent` 类型，这是定义一个 Vue 组件的标准类型。
// * `const component: DefineComponent<{}, {}, any>`：我们声明了一个常量 `component`，它的类型是一个 Vue 组件。
// * `export default component`：我们声明这个模块的默认导出的就是上面那个组件。
// * `/// <reference types="vite/client" />`：这一行是为了确保 Vite 的客户端类型（比如 `import.meta.env`）也能被正确识别，通常是自动生成的，加上没有坏处。