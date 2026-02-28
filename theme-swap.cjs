const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        if (fs.statSync(dirFile).isDirectory()) {
            filelist = walkSync(dirFile, filelist);
        } else {
            if (dirFile.endsWith('.jsx') || dirFile.endsWith('.js')) {
                filelist.push(dirFile);
            }
        }
    });
    return filelist;
};

const mapReplacements = {
    'bg-white': 'bg-kynex-surface',
    'bg-slate-50': 'bg-kynex-bg',
    'bg-slate-100': 'bg-kynex-surface/50',
    'bg-slate-900': 'bg-kynex-bg border-r border-kynex-text/10',
    'text-slate-900': 'text-kynex-text',
    'text-slate-800': 'text-kynex-text',
    'text-slate-700': 'text-kynex-text/90',
    'text-slate-600': 'text-kynex-text/70',
    'text-slate-500': 'text-kynex-text/50',
    'text-slate-400': 'text-kynex-text/40',
    'border-slate-100': 'border-kynex-text/5',
    'border-slate-200': 'border-kynex-text/10',
    'border-slate-300': 'border-kynex-text/20',
    'divide-slate-100': 'divide-kynex-text/5',
    'divide-slate-200': 'divide-kynex-text/10',
    'bg-blue-50': 'bg-kynex-primary/10',
    'bg-blue-100': 'bg-kynex-primary/20',
    'bg-blue-600': 'bg-kynex-primary',
    'hover:bg-blue-700': 'hover:bg-kynex-primaryHover',
    'text-blue-600': 'text-kynex-primary',
    'text-blue-700': 'text-kynex-primary',
    'text-blue-500': 'text-kynex-primary',
    'border-blue-200': 'border-kynex-primary/30',
    'border-blue-300': 'border-kynex-primary/40',
    'ring-blue-500': 'ring-kynex-primary',

    // Modifiers
    'hover:bg-slate-50': 'hover:bg-kynex-surface',
    'hover:bg-slate-100': 'hover:bg-kynex-surface',
    'hover:text-slate-700': 'hover:text-kynex-text/80',
    'hover:text-slate-800': 'hover:text-kynex-text/90',
    'hover:text-slate-900': 'hover:text-kynex-text',

    // Branding
    '"GrowthPilot"': '"Kynex AI"',
    '>GrowthPilot<': '>Kynex AI<'
};

const files = walkSync(path.join(__dirname, 'src'));

let modifiedCount = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    Object.keys(mapReplacements).forEach(key => {
        // Escape string for regex, except we don't need regex for simple splits
        content = content.split(key).join(mapReplacements[key]);
    });

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        modifiedCount++;
        console.log(`Modified: ${path.relative(__dirname, file)}`);
    }
});

console.log(`\nUpdated ${modifiedCount} files.`);
