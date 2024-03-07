let warnCount = 0;
const maxWarnings = 500;

// Логер предупреждений для обработки потенциальных ошибок
// Максимум ошибок 500

export function warn(...args: any[])
{
    if (warnCount === maxWarnings) return;

    warnCount++;

    if (warnCount === maxWarnings)
    {
        console.warn('Spectrograph Warning: too many warnings, no more warnings will be reported to the console by Spectrograph.');
    }
    else
    {
        console.warn('Spectrograph Warning: ', ...args);
    }
}
