"use client"

import React from "react";
import { ClickUIProvider } from "@clickhouse/click-ui";


export default function ThemeProvider({ children }) {
    return (
        <ClickUIProvider theme="dark">
            {children}
        </ClickUIProvider>
    )
}
