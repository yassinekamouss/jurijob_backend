const fs = require('fs');
const path = require('path');

/**
 * Ensures all required directories exist on startup.
 */
const initStorage = () => {
    const requiredDirs = [
        path.join(__dirname, '../public/diplomas'),
        // Add other folders here as your app grows
    ];

    requiredDirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Directory created: ${dir}`);
        }
    });
};

module.exports = initStorage;
