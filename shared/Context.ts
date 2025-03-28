import React from "react";
import {
    SettingsContextType,
    ArticleListType,
    ArticleType,
    ConnectionType,
    ConnectionListType,
} from "@/shared/Types";

export const SettingsContext = React.createContext<SettingsContextType>({
    settings: { mode: "light" },
    setSettings: () => {},
});

export const ArticleContext = React.createContext<ArticleListType>([]);
export const ArticleDispatchContext = React.createContext<{
    article_dispatch: React.Dispatch<any>;
}>({
    article_dispatch: () => null,
});

export const ConnectionContext = React.createContext<ConnectionListType>([]);
export const ConnectionDispatchContext = React.createContext<{
    connection_dispatch: React.Dispatch<any>;
}>({
    connection_dispatch: () => null,
});

interface EditArticleContextType {
    article: ArticleType | null;
}

// initiate context
export const EditArticleContext = React.createContext<EditArticleContextType>({
    article: null,
});

interface EditConnectionContextType {
    connection: ConnectionType | null;
}

// initiate context
export const EditConnectionContext =
    React.createContext<EditConnectionContextType>({
        connection: null,
    });
