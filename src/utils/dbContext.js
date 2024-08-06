import React, { createContext, useState } from 'react';
import * as SQLite from 'expo-sqlite/legacy';
import { initFuncs } from '../db/initFuncs';
import { Alert } from 'react-native';

export const DbContext = createContext();

export const DbProvider = ({ children }) => {
  let db = SQLite.openDatabase(initFuncs.dbInit);

  return (
    <DbContext.Provider
      value={{
        db,
      }}
    >
      {children}
    </DbContext.Provider>
  );
};
