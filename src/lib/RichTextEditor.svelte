<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';

	let { value = $bindable(''), placeholder = '' } = $props();

	let editorElement: HTMLDivElement;
	let editor: Editor | null = null;

	onMount(() => {
		if (!editorElement) return;

		editor = new Editor({
			element: editorElement,
			extensions: [
				StarterKit.configure({
					heading: false,
					codeBlock: false,
					blockquote: false,
					horizontalRule: false,
					bulletList: false,
					orderedList: false,
					code: false
				}),
				Link.configure({
					openOnClick: false,
					HTMLAttributes: {
						class: 'editor-link'
					}
				})
			],
			content: value || '',
			editorProps: {
				attributes: {
					class: 'tiptap-editor',
					'data-placeholder': placeholder
				}
			},
			onUpdate: ({ editor }) => {
				const html = editor.getHTML();
				if (html !== value) {
					value = html;
				}
			}
		});

		// Watch for external value changes
		const stopWatching = () => {
			if (editor && value !== undefined && editor.getHTML() !== value) {
				editor.commands.setContent(value || '');
			}
		};

		return stopWatching;
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});

	function setBold() {
		editor?.chain().focus().toggleBold().run();
	}

	function setItalic() {
		editor?.chain().focus().toggleItalic().run();
	}

	function setLink() {
		const previousUrl = editor?.getAttributes('link').href;
		const url = window.prompt('Enter URL:', previousUrl || '');
		if (url) {
			editor?.chain().focus().setLink({ href: url }).run();
		}
	}

	function removeLink() {
		editor?.chain().focus().unsetLink().run();
	}

	function isActive(extension: string) {
		return editor?.isActive(extension) ?? false;
	}
</script>

<div class="rich-text-editor">
	<div class="toolbar">
		<button
			type="button"
			class="toolbar-btn"
			class:active={isActive('bold')}
			onclick={setBold}
			title="Bold"
		>
			<strong>B</strong>
		</button>
		<button
			type="button"
			class="toolbar-btn"
			class:active={isActive('italic')}
			onclick={setItalic}
			title="Italic"
		>
			<em>I</em>
		</button>
		<button
			type="button"
			class="toolbar-btn"
			class:active={isActive('link')}
			onclick={setLink}
			title="Insert Link"
		>
			Link
		</button>
		{#if isActive('link')}
			<button
				type="button"
				class="toolbar-btn"
				onclick={removeLink}
				title="Remove Link"
			>
				Unlink
			</button>
		{/if}
	</div>
	<div bind:this={editorElement} class="editor-container"></div>
</div>

<style>
	.rich-text-editor {
		border: 2px solid var(--border-color);
		border-radius: 8px;
		background: white;
		transition: border-color 0.3s;
		overflow: hidden;
	}

	.rich-text-editor:focus-within {
		border-color: var(--primary-color);
		box-shadow: 0 0 0 3px rgba(15, 33, 67, 0.1);
	}

	.toolbar {
		display: flex;
		gap: 0.25rem;
		padding: 0.5rem;
		border-bottom: 1px solid var(--border-color);
		background: var(--bg-light);
		flex-wrap: wrap;
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

	.toolbar-btn.active {
		background: var(--primary-color);
		color: white;
		border-color: var(--primary-color);
	}

	.toolbar-btn strong,
	.toolbar-btn em {
		font-style: normal;
		font-weight: 700;
	}

	.editor-container {
		min-height: 150px;
		padding: 0.875rem 1rem;
	}

	.editor-placeholder {
		color: #999;
		font-style: italic;
		pointer-events: none;
	}

	:global(.tiptap-editor) {
		min-height: 150px;
		font-size: 1rem;
		font-family: inherit;
		line-height: 1.6;
		outline: none;
		overflow-y: auto;
		max-height: 400px;
	}

	:global(.tiptap-editor p) {
		margin: 0 0 0.75rem 0;
	}

	:global(.tiptap-editor p:last-child) {
		margin-bottom: 0;
	}

	:global(.tiptap-editor p.is-editor-empty:first-child::before) {
		content: attr(data-placeholder);
		float: left;
		color: #999;
		pointer-events: none;
		height: 0;
		font-style: italic;
	}

	:global(.tiptap-editor:focus p.is-editor-empty:first-child::before) {
		opacity: 0.5;
	}

	:global(.tiptap-editor .editor-link) {
		color: var(--primary-color);
		text-decoration: underline;
		cursor: pointer;
	}

	:global(.tiptap-editor .editor-link:hover) {
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
