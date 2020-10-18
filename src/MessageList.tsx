import React, { Ref, useImperativeHandle, forwardRef } from "react";

export interface RefObject {
  sayHi: () => void;
}

interface Props {}

const MessageList = ({}: Props, ref: Ref<RefObject>) => {
  useImperativeHandle(ref, () => ({ sayHi }));
  const sayHi = () => {
    console.log("helloooo");
  };

  return <div>MessageList</div>;
};

export default forwardRef(MessageList);
