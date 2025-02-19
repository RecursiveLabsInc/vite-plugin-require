export default function vitePluginRequire(opts?: {
    fileRegex?: RegExp;
    log?: (...arg: any[]) => void;
    translateType?: "importMetaUrl" | "import";
}): {
    name: string;
    configResolved(resolvedConfig: any): void;
    transform(code: string, id: string): Promise<{
        code: string;
        map: {
            version: number;
            sources: string[];
            names: string[];
            sourceRoot?: string | undefined;
            sourcesContent?: string[] | undefined;
            mappings: string;
            file: string;
        };
    }>;
};
