export default function set<Entity = any, Output = Entity, Value = any>(entity: Entity, paths: (string | number)[], value: Value, removeIfUndefined?: boolean): Output;
