# Staged Components

Make React function component staged.

## Install

```bash
yarn add staged-components
# or
npm install --save staged-components
```

## Usages

React Hook is awesome, but it has some kind of rules. One of these rules is ["Only Call Hooks at the Top Level"](https://reactjs.org/docs/hooks-rules.html#only-call-hooks-at-the-top-level).

So the component below will cause an error:

```jsx
const App = function(props) {
  if (props.user === undefined) return null
  const [name, setName] = useState(props.user.name)
  // React Hook "useState" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?
  return (
    <input value={name} onChange={(e) => {setName(e.target.value)}}/>
  )
}
```

With `staged-components`, you can safely "break" this rule:

```jsx
const App = staged((props) => { // stage 1
  if (props.user === undefined) return null
  return () => { // stage 2
    const [name, setName] = useState(props.user.name)
    return (
      <input value={name} onChange={(e) => {setName(e.target.value)}}/>
    )
  }
})
```

## Advanced

Usage with `forwardRef`:

```jsx
const App = forwardRef(staged((props, ref) => {
  if (props.user === undefined) return null
  return () => {
    useImperativeHandle(ref, () => 'hello')
    return (
      <h1>{props.user.name}</h1>
    )
  }
}))
```
