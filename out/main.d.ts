interface StackShareCategory {
    name: string;
    tools: {
        name: string;
        base64img: string;
        type: string;
    }[];
}
export default function parseStackShare(url: string): Promise<StackShareCategory[]>;
export {};
