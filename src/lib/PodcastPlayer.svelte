<script lang="ts">
	let { episodes = [] } = $props<{
		episodes?: Array<{
			title: string;
			date?: string;
			description?: string;
			audioUrl: string;
			duration?: string;
		}>;
	}>();

	let currentEpisodeIndex = $state(0);
	let currentEpisode = $derived(episodes[currentEpisodeIndex] || episodes[0]);
	let audioElement: HTMLAudioElement | null = $state(null);
	let isPlaying = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let volume = $state(1);
	
	const isGoogleDriveUrl = $derived(currentEpisode?.audioUrl?.includes('drive.google.com') || false);

	function formatTime(seconds: number): string {
		if (isNaN(seconds)) return '0:00';
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function togglePlay() {
		if (!audioElement) return;
		if (isPlaying) {
			audioElement.pause();
		} else {
			audioElement.play();
		}
		isPlaying = !isPlaying;
	}

	function setEpisode(index: number) {
		if (audioElement) {
			audioElement.pause();
		}
		currentEpisodeIndex = index;
		isPlaying = false;
		currentTime = 0;
		if (audioElement) {
			audioElement.load();
		}
	}

	function seek(event: Event) {
		if (!audioElement) return;
		const target = event.target as HTMLInputElement;
		const time = (parseFloat(target.value) / 100) * duration;
		audioElement.currentTime = time;
		currentTime = time;
	}

	function setVolume(event: Event) {
		if (!audioElement) return;
		const target = event.target as HTMLInputElement;
		volume = parseFloat(target.value);
		audioElement.volume = volume;
	}

	function updateTime() {
		if (!audioElement) return;
		currentTime = audioElement.currentTime;
	}

	function updateDuration() {
		if (!audioElement) return;
		duration = audioElement.duration;
	}

	function ended() {
		isPlaying = false;
		currentTime = 0;
	}
</script>

<div class="podcast-player">
	{#if episodes.length > 1}
		<div class="episode-selector">
			<label for="episode-select">Select Episode:</label>
			<select
				id="episode-select"
				value={currentEpisodeIndex}
				onchange={(e) => setEpisode(parseInt((e.target as HTMLSelectElement).value))}
			>
				{#each episodes as episode, index}
					<option value={index}>{episode.title}</option>
				{/each}
			</select>
		</div>
	{/if}

	<div class="player-card">
		<div class="player-header">
			<h3>{currentEpisode?.title || 'No episode selected'}</h3>
			{#if currentEpisode?.date}
				<span class="episode-date">{currentEpisode.date}</span>
			{/if}
		</div>

		{#if currentEpisode?.description}
			<p class="episode-description">{currentEpisode.description}</p>
		{/if}

		{#if isGoogleDriveUrl}
			<div class="google-drive-notice">
				<p>This audio is hosted on Google Drive. Click the button below to play it.</p>
				<a href={currentEpisode?.audioUrl} target="_blank" rel="noopener noreferrer" class="google-drive-button">
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M8 5v14l11-7z" />
					</svg>
					<span>Play on Google Drive</span>
				</a>
			</div>
		{:else}
			<audio
				bind:this={audioElement}
				ontimeupdate={updateTime}
				onloadedmetadata={updateDuration}
				onended={ended}
				preload="metadata"
			>
				{#if currentEpisode?.audioUrl}
					<source src={currentEpisode.audioUrl} type="audio/mpeg" />
					Your browser does not support the audio element.
				{/if}
			</audio>
		{/if}

		{#if !isGoogleDriveUrl}
		<div class="player-controls">
			<button class="play-button" onclick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
				{#if isPlaying}
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
					</svg>
				{:else}
					<svg viewBox="0 0 24 24" fill="currentColor">
						<path d="M8 5v14l11-7z" />
					</svg>
				{/if}
			</button>

			<div class="progress-section">
				<div class="time-display">
					<span>{formatTime(currentTime)}</span>
					<span class="duration">{formatTime(duration)}</span>
				</div>
				<input
					type="range"
					min="0"
					max="100"
					value={duration > 0 ? (currentTime / duration) * 100 : 0}
					oninput={seek}
					class="progress-bar"
					aria-label="Seek"
				/>
			</div>

			<div class="volume-control">
				<svg viewBox="0 0 24 24" fill="currentColor" class="volume-icon">
					<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
				</svg>
				<input
					type="range"
					min="0"
					max="1"
					step="0.01"
					value={volume}
					oninput={setVolume}
					class="volume-bar"
					aria-label="Volume"
				/>
			</div>
		</div>
		{/if}
	</div>
</div>

<style>
	.podcast-player {
		width: 100%;
		margin: 2rem 0;
	}

	.episode-selector {
		margin-bottom: 1.5rem;
	}

	.episode-selector label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: var(--text-color);
	}

	.episode-selector select {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 2px solid var(--border-color);
		border-radius: 8px;
		background: white;
		color: var(--text-color);
		font-size: 1rem;
		cursor: pointer;
		transition: border-color 0.3s;
	}

	.episode-selector select:hover {
		border-color: var(--primary-color);
	}

	.episode-selector select:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px rgba(15, 33, 67, 0.1);
	}

	.player-card {
		background: white;
		border-radius: 16px;
		padding: 2rem;
		box-shadow: var(--shadow-lg);
		border: 2px solid var(--border-color);
	}

	.player-header {
		margin-bottom: 1rem;
	}

	.player-header h3 {
		margin: 0 0 0.5rem 0;
		color: var(--primary-color);
		font-size: 1.5rem;
	}

	.episode-date {
		color: var(--text-light);
		font-size: 0.9rem;
	}

	.episode-description {
		color: var(--text-light);
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	.player-controls {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.play-button {
		background: linear-gradient(135deg, var(--cerulean-blue) 0%, var(--pacific-blue) 100%);
		color: white;
		border: none;
		border-radius: 50%;
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: var(--shadow);
		flex-shrink: 0;
	}

	.play-button:hover {
		transform: scale(1.05);
		box-shadow: var(--shadow-lg);
	}

	.play-button svg {
		width: 28px;
		height: 28px;
	}

	.progress-section {
		flex: 1;
		min-width: 200px;
	}

	.time-display {
		display: flex;
		justify-content: space-between;
		font-size: 0.85rem;
		color: var(--text-light);
		margin-bottom: 0.5rem;
		font-weight: 500;
	}

	.duration {
		color: var(--text-light);
	}

	.progress-bar {
		width: 100%;
		height: 6px;
		border-radius: 3px;
		background: var(--border-color);
		outline: none;
		-webkit-appearance: none;
		appearance: none;
		cursor: pointer;
	}

	.progress-bar::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--primary-color);
		cursor: pointer;
		transition: all 0.2s;
	}

	.progress-bar::-webkit-slider-thumb:hover {
		background: var(--grass-green);
		transform: scale(1.2);
	}

	.progress-bar::-moz-range-thumb {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--primary-color);
		cursor: pointer;
		border: none;
		transition: all 0.2s;
	}

	.progress-bar::-moz-range-thumb:hover {
		background: var(--grass-green);
		transform: scale(1.2);
	}

	.volume-control {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 120px;
	}

	.volume-icon {
		width: 20px;
		height: 20px;
		color: var(--text-light);
		flex-shrink: 0;
	}

	.volume-bar {
		flex: 1;
		height: 4px;
		border-radius: 2px;
		background: var(--border-color);
		outline: none;
		-webkit-appearance: none;
		appearance: none;
		cursor: pointer;
	}

	.volume-bar::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--primary-color);
		cursor: pointer;
	}

	.volume-bar::-moz-range-thumb {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--primary-color);
		cursor: pointer;
		border: none;
	}

	.google-drive-notice {
		background: linear-gradient(135deg, rgba(15, 33, 67, 0.1) 0%, rgba(53, 78, 86, 0.1) 100%);
		padding: 1.5rem;
		border-radius: 12px;
		margin: 1.5rem 0;
		text-align: center;
	}

	.google-drive-notice p {
		margin: 0 0 1rem 0;
		color: var(--text-light);
		font-size: 0.95rem;
	}

	.google-drive-button {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		background: linear-gradient(135deg, var(--cerulean-blue) 0%, var(--pacific-blue) 100%);
		color: white;
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		text-decoration: none;
		font-weight: 600;
		transition: all 0.3s ease;
		box-shadow: var(--shadow);
	}

	.google-drive-button:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
		background: linear-gradient(135deg, var(--pacific-blue) 0%, var(--grass-green) 100%);
	}

	.google-drive-button svg {
		width: 20px;
		height: 20px;
	}

	@media (max-width: 768px) {
		.player-card {
			padding: 1.5rem;
		}

		.player-controls {
			flex-direction: column;
			align-items: stretch;
		}

		.progress-section {
			width: 100%;
		}

		.volume-control {
			width: 100%;
		}

		.play-button {
			width: 50px;
			height: 50px;
		}

		.play-button svg {
			width: 24px;
			height: 24px;
		}
	}
</style>

