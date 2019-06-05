import chalk from "chalk";

export function logMessage(caller: string, error: string, type = "INFO"): void {
    const currentTime = new Date();
    const date = chalk.yellow(currentTime.toLocaleDateString());
    const time = chalk.green(currentTime.toLocaleTimeString());
    const typePrint = type === "ERROR"
        ? chalk.red(type)
        : type === "WARN"
            ? chalk.yellow(type)
            : chalk.green(type);
    console.log(`${date} ${time} | ${typePrint} ${caller} - ${error}`);
}

export function logError(caller: string, error: string): void {
    logMessage(caller, error, "ERROR");
}

export function logWarning(caller: string, error: string): void {
    logMessage(caller, error, "WARN");
}
