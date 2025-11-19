import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { CardSettingsProvider } from './providers/CardSettingProvider.tsx';
import { DEFAULT_TAG, log, LogLevel } from 'missionlog';
import chalk from 'chalk';
import { SnackbarProvider } from 'notistack';

const logger = {
    [LogLevel.ERROR]: (tag, msg, params) => console.error(`[${chalk.red(tag)}]`, msg, ...params),
    [LogLevel.WARN]: (tag, msg, params) => console.warn(`[${chalk.yellow(tag)}]`, msg, ...params),
    [LogLevel.INFO]: (tag, msg, params) => console.log(`[${chalk.greenBright(tag)}]`, msg, ...params),
    [LogLevel.TRACE]: (tag, msg, params) => console.log(`[${chalk.cyan(tag)}]`, msg, ...params),
    [LogLevel.DEBUG]: (tag, msg, params) => console.log(`[${chalk.magenta(tag)}]`, msg, ...params),
} as Record<LogLevel, (tag: string, msg: unknown, params: unknown[]) => void>;

log.init({
    cardClass: LogLevel.INFO,
    gridClass: LogLevel.INFO,
    general: LogLevel.INFO,
    [DEFAULT_TAG]: LogLevel.WARN
}, (level, tag, msg, params) => {
    logger[level as keyof typeof logger](tag, msg, params);
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SnackbarProvider maxSnack={5} autoHideDuration={5000}>
            <CardSettingsProvider>
                <App />
            </CardSettingsProvider>
        </SnackbarProvider>
    </StrictMode>,
)
