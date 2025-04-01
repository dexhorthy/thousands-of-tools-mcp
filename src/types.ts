export interface ServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface ServerConfigs {
  [key: string]: ServerConfig;
}

export interface ServerResult {
  tools: any[];
  transport: any;
}

export interface ServerResults {
  [key: string]: ServerResult;
}