/// <reference types="react" />
import { FullGestureState, State, EventTypes } from './state';
import { GestureKey } from './config';
export declare type Handler<Key extends GestureKey, EventType = EventTypes[Key]> = (state: Omit<FullGestureState<Key>, 'event'> & {
    event: EventType;
}) => any | void;
declare type check<T extends AnyHandlerEventTypes, Key extends GestureKey> = undefined extends T[Key] ? EventTypes[Key] : T[Key];
export declare type UserHandlers<T extends AnyHandlerEventTypes = EventTypes> = {
    onDrag: Handler<'drag', check<T, 'drag'>>;
    onDragStart: Handler<'drag', check<T, 'drag'>>;
    onDragEnd: Handler<'drag', check<T, 'drag'>>;
    onPinch: Handler<'pinch', check<T, 'pinch'>>;
    onPinchStart: Handler<'pinch', check<T, 'pinch'>>;
    onPinchEnd: Handler<'pinch', check<T, 'pinch'>>;
    onWheel: Handler<'wheel', check<T, 'wheel'>>;
    onWheelStart: Handler<'wheel', check<T, 'wheel'>>;
    onWheelEnd: Handler<'wheel', check<T, 'wheel'>>;
    onMove: Handler<'move', check<T, 'move'>>;
    onMoveStart: Handler<'move', check<T, 'move'>>;
    onMoveEnd: Handler<'move', check<T, 'move'>>;
    onScroll: Handler<'scroll', check<T, 'scroll'>>;
    onScrollStart: Handler<'scroll', check<T, 'scroll'>>;
    onScrollEnd: Handler<'scroll', check<T, 'scroll'>>;
    onHover: Handler<'hover', check<T, 'hover'>>;
};
export declare type ReactDOMAttributes = Omit<React.DOMAttributes<EventTarget>, 'children' | 'dangerouslySetInnerHTML' | keyof UserHandlers>;
declare type NativeHandlersKeys = keyof ReactDOMAttributes;
declare type GetEventType<Key extends NativeHandlersKeys> = ReactDOMAttributes[Key] extends React.EventHandler<infer EventType> | undefined ? EventType : UIEvent;
export declare type NativeHandlers<T extends AnyHandlerEventTypes = {}> = {
    [key in NativeHandlersKeys]?: (state: State['shared'] & {
        event: undefined extends T[key] ? GetEventType<key> : T[key];
        args: any;
    }, ...args: any) => void;
};
export declare type AnyHandlerEventTypes = Partial<{
    drag: any;
    wheel: any;
    scroll: any;
    move: any;
    pinch: any;
    hover: any;
} & {
    [key in NativeHandlersKeys]: any;
}>;
export declare type GestureHandlers<HandlerType extends AnyHandlerEventTypes = EventTypes> = Partial<NativeHandlers<HandlerType> & UserHandlers<HandlerType>>;
export declare type InternalHandlers = {
    [Key in GestureKey]?: Handler<Key, any>;
};
export {};
