import { nanoid } from 'nanoid';
import React, { useReducer, useState } from 'react';
import type { FC, PropsWithChildren, Reducer } from 'react';

import { ModalContext, Windows } from './ModalContext';

// eslint-disable-next-line @typescript-eslint/ban-types
export type ModalProviderProps = {};

type WindowStack = Record<string, Windows>;

type WindowAction =
  | {
      type: 'ADD_WINDOW';
      id: string;
      window: Windows;
    }
  | {
      type: 'UPDATE_WINDOW';
      id: string;
      window: Windows;
    }
  | {
      type: 'REMOVE_WINDOW';
      id: string;
    };

const windowStackReducer: Reducer<WindowStack, WindowAction> = (
  state,
  action,
) => {
  const newWindows = { ...state };
  switch (action.type) {
    case 'ADD_WINDOW': {
      newWindows[action.id] = action.window;
      return newWindows;
    }
    case 'REMOVE_WINDOW': {
      delete newWindows[action.id];
      return newWindows;
    }
    case 'UPDATE_WINDOW': {
      newWindows[action.id] = action.window;
      return newWindows;
    }
    default:
      return state;
  }
};

export const ModalProvider: FC<PropsWithChildren<ModalProviderProps>> = ({
  children,
}) => {
  const [windows, dispatch] = useReducer(windowStackReducer, {});
  const [activeWindow, setActiveWindow] = useState<string>();

  const addWindows = (window: Windows) => {
    const id = nanoid();
    dispatch({ type: 'ADD_WINDOW', id, window });

    return id;
  };
  const removeWindow = (id: string) => {
    dispatch({ type: 'REMOVE_WINDOW', id });
  };
  const updateWindow = (id: string, window: Windows) => {
    dispatch({ type: 'UPDATE_WINDOW', id, window });
  };

  return (
    <ModalContext.Provider
      value={{
        windows,
        addWindows,
        removeWindow,
        updateWindow,
        setActiveWindow,
        activeWindow,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
