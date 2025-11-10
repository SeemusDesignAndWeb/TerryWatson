import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { existsSync, readdirSync, copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import type { Plugin } from 'vite';

// Custom plugin to conditionally copy data files
// Preserves existing production files, only creates missing ones
function conditionalDataCopy(): Plugin {
	const buildDataDir = join(process.cwd(), 'build', 'lib', 'data');
	const persistentDataDir = join(process.cwd(), 'lib', 'data');
	let existingFiles: Map<string, string> = new Map();

	return {
		name: 'conditional-data-copy',
		buildStart() {
			// Before build: backup existing files from multiple possible locations
			existingFiles.clear();
			
			// Check persistent location first (outside build directory - more likely to survive)
			const locationsToCheck = [persistentDataDir, buildDataDir];
			
			for (const dataDir of locationsToCheck) {
				if (existsSync(dataDir)) {
					try {
						const files = readdirSync(dataDir);
						files
							.filter(file => file.endsWith('.json'))
							.forEach(file => {
								// Only add if we haven't found this file yet
								if (!existingFiles.has(file)) {
									const filePath = join(dataDir, file);
									try {
										existingFiles.set(file, readFileSync(filePath, 'utf-8'));
									} catch {
										// Ignore if can't read
									}
								}
							});
					} catch (error) {
						// Directory might not exist yet, that's okay
					}
				}
			}
			
			if (existingFiles.size > 0) {
				console.log(`📦 Found ${existingFiles.size} existing data file(s) to preserve`);
			}
		},
		writeBundle() {
			const dataDir = join(process.cwd(), 'src/lib/data');
			
			if (!existsSync(dataDir)) {
				// No source files, but restore existing if we have them
				if (existingFiles.size > 0) {
					try {
						if (!existsSync(buildDataDir)) {
							mkdirSync(buildDataDir, { recursive: true });
						}
						if (!existsSync(persistentDataDir)) {
							mkdirSync(persistentDataDir, { recursive: true });
						}
						
						existingFiles.forEach((content, file) => {
							// Write to both locations for redundancy
							const buildPath = join(buildDataDir, file);
							const persistentPath = join(persistentDataDir, file);
							
							writeFileSync(buildPath, content, 'utf-8');
							writeFileSync(persistentPath, content, 'utf-8');
							console.log(`♻️  Restored ${file} from previous deployment`);
						});
					} catch (error) {
						console.warn('Could not restore existing data files:', error);
					}
				}
				return;
			}

			try {
				// Ensure destination directories exist
				if (!existsSync(buildDataDir)) {
					mkdirSync(buildDataDir, { recursive: true });
				}
				if (!existsSync(persistentDataDir)) {
					mkdirSync(persistentDataDir, { recursive: true });
				}

				const sourceFiles = readdirSync(dataDir).filter(file => file.endsWith('.json'));
				
				sourceFiles.forEach(file => {
					const buildPath = join(buildDataDir, file);
					const persistentPath = join(persistentDataDir, file);
					
					// If file exists from previous deployment, preserve it (don't overwrite)
					if (existingFiles.has(file)) {
						const preservedContent = existingFiles.get(file)!;
						writeFileSync(buildPath, preservedContent, 'utf-8');
						writeFileSync(persistentPath, preservedContent, 'utf-8');
						console.log(`⊘ Preserved ${file} - existing production file not overwritten`);
					} else {
						// File doesn't exist, copy from source
						const srcPath = join(dataDir, file);
						if (existsSync(srcPath)) {
							copyFileSync(srcPath, buildPath);
							copyFileSync(srcPath, persistentPath);
							console.log(`✓ Copied ${file} - new file created`);
						}
					}
				});
			} catch (error) {
				console.warn('Could not copy data files:', error);
			}
		}
	};
}

export default defineConfig({
	plugins: [
		sveltekit(),
		// Custom plugin that copies data files only if they don't exist
		// This ensures: existing production files are preserved, missing files are created
		conditionalDataCopy()
	]
});
