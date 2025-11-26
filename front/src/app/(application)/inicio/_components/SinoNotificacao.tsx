"use client";

import { MouseEventHandler } from "react";
import { IoNotifications } from "react-icons/io5";


type Props = {
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export default function SinoNotificacao({ onClick } : Props) {
  return (
    <button 
      className="btn btn-circle cursor-pointer"
      onClick={onClick}
    >
      <IoNotifications className="text-xl" />
    </button>
  );
}