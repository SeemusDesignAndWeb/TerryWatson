<script lang="ts">
	let { value = $bindable(''), placeholder = '' } = $props();

	let editorElement: HTMLDivElement;
	let isFocused = $state(false);
	let isUpdating = $state(false);

	$effect(() => {
		if (editorElement && !isUpdating && editorElement.innerHTML !== value) {
			editorElement.innerHTML = value || '';
		}
	});

	function execCommand(command: string, value?: string) {
		document.execCommand(command, false, value);
		editorElement.focus();
		updateValue();
	}

	function insertLink() {
		const url = prompt('Enter URL:');
		if (url) {
			execCommand('createLink', url);
		}
	}

	function removeFormat() {
		execCommand('removeFormat');
		execCommand('unlink');
	}

	function updateValue() {
		isUpdating = true;
		value = editorElement.innerHTML;
		setTimeout(() => {
			isUpdating = false;
		}, 0);
	}

	function handlePaste(e: ClipboardEvent) {
		e.preventDefault();
		const text = e.clipboardData?.getData('text/plain') || '';
		document.execCommand('insertText', false, text);
		updateValue();
	}

	function handleKeydown(e: KeyboardEvent) {
		// Allow Enter key to create line breaks
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			document.execCommand('insertHTML', false, '<br>');
			updateValue();
		}
	}
</script>

<div class="rich-text-editor" class:focused={isFocused}>
	<div class="toolbar">
		<button
			type="button"
			class="toolbar-btn"
			onclick={() => execCommand('bold')}
			title="Bold"
		>
			<strong>B</strong>
		</button>
		<button
			type="button"
			class="toolbar-btn"
			onclick={() => execCommand('italic')}
			title="Italic"
		>
			<em>I</em>
		</button>
		<button
			type="button"
			class="toolbar-btn"
			onclick={insertLink}
			title="Insert Link"
		>
			Link
		</button>
		<button
			type="button"
			class="toolbar-btn"
			onclick={removeFormat}
			title="Remove Formatting"
		>
			Clear
		</button>
	</div>
	<div
		bind:this={editorElement}
		class="editor"
		contenteditable="true"
		data-placeholder={placeholder}
		innerHTML={value}
		oninput={updateValue}
		onpaste={handlePaste}
		onkeydown={handleKeydown}
		onfocus={() => (isFocused = true)}
		onblur={() => (isFocused = false)}
	></div>
</div>

<style>
	.rich-text-editor {
		border: 2px solid var(--border-color);
		border-radius: 8px;
		background: white;
		transition: border-color 0.3s;
	}

	.rich-text-editor.focused {
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px rgba(15, 33, 67, 0.1);
	}

	.toolbar {
		display: flex;
		gap: 0.25rem;
		padding: 0.5rem;
		border-bottom: 1px solid var(--border-color);
		background: var(--bg-light);
		border-radius: 8px 8px 0 0;
	}

	.toolbar-btn {
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--border-color);
		background: white;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.2s;
		color: var(--text-color);
	}

	.toolbar-btn:hover {
		background: var(--primary-color);
		color: white;
		border-color: var(--primary-color);
	}

	.toolbar-btn strong,
	.toolbar-btn em {
		font-style: normal;
		font-weight: 700;
	}

	.editor {
		min-height: 150px;
		padding: 0.875rem 1rem;
		font-size: 1rem;
		font-family: inherit;
		line-height: 1.6;
		outline: none;
		overflow-y: auto;
		max-height: 400px;
	}

	.editor:empty:before {
		content: attr(data-placeholder);
		color: #999;
		font-style: italic;
	}

	.editor p {
		margin: 0 0 0.75rem 0;
	}

	.editor p:last-child {
		margin-bottom: 0;
	}

	.editor a {
		color: var(--primary-color);
		text-decoration: underline;
	}

	.editor a:hover {
		color: var(--grass-green);
	}

	@media (max-width: 768px) {
		.toolbar {
			flex-wrap: wrap;
		}

		.toolbar-btn {
			padding: 0.4rem 0.6rem;
			font-size: 0.8rem;
		}
	}
</style>

