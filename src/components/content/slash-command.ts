import { CommandProps, Editor, Extension, Range } from '@tiptap/core';
import Suggestion, { SuggestionProps } from '@tiptap/suggestion';
import { VueRenderer } from '@tiptap/vue-3';
import tippy, { Instance, Props } from 'tippy.js';
import { BCMSPropValueExtended, SlashCommandItem } from '../../types';
import CommandsList from './slash-command-list.vue';

interface CommandData {
  editor: CommandProps;
  range: Range;
}

export function createBcmsSlashCommand({
  allowedWidgets,
}: {
  allowedWidgets?: string[];
}): Extension<any> {
  return Extension.create({
    name: 'mention',
    defaultOptions: {
      suggestion: {
        char: '/',
        startOfLine: true,
        command: ({ editor, range, props }: any) => {
          props.command({ editor, range });
        },
      },
    },

    addProseMirrorPlugins() {
      return [
        Suggestion({
          editor: this.editor,
          ...this.options.suggestion,
          bane: 'WTF',
        } as any),
      ];
    },
  }).configure({
    defaultOptions: {
      bane: 'WOOO',
    },
    suggestion: {
      bane: 'IIIIIIIIIIIIIIII',
      async items(query: string) {
        const store = window.bcms.sdk.store;
        const widgets = store.getters.widget_items;

        const headings = new Array(6).fill({}).map((_, index) => {
          return {
            title: `Heading ${index + 1}`,
            icon: `/editor/heading/h${index + 1}`,
            command: (data: CommandData) => {
              data.editor
                .chain()
                .focus()
                .deleteRange(data.range)
                .setNode('heading', { level: index + 1 })
                .run();
            },
          };
        });

        const wdgts: Array<SlashCommandItem> = [];

        for (let i = 0; i < widgets.length; i++) {
          const widget = widgets[i];
          if (!allowedWidgets || allowedWidgets.includes(widget._id)) {
            const values: BCMSPropValueExtended[] = [];
            for (let j = 0; j < widget.props.length; j++) {
              const prop = widget.props[j];
              const propExtended = await window.bcms.prop.toPropValueExtended({
                prop,
              });

              if (propExtended) {
                values.push(propExtended);
              }
            }

            wdgts.push({
              title: `${widget.name}`,
              widget: true,
              icon: `/administration/widget`,
              command: () => {
                return (window.bcms.editor?.value as Editor).chain().setWidget({
                  widget,
                  content: values,
                });
              },
            });
          }
        }

        return [
          ...headings,
          {
            title: 'Paragraph',
            icon: '/editor/text',
            command: (data: CommandData) => {
              data.editor
                .chain()
                .focus()
                .deleteRange(data.range)
                .setNode('paragraph')
                .run();
            },
          },
          {
            title: 'Bullet List',
            icon: '/editor/list-ul',
            command: (data: CommandData) => {
              data.editor
                .chain()
                .focus()
                .deleteRange(data.range)
                .toggleBulletList()
                .run();
            },
          },
          {
            title: 'Ordered List',
            icon: '/editor/list-ol',
            command: (data: CommandData) => {
              data.editor
                .chain()
                .focus()
                .deleteRange(data.range)
                .toggleOrderedList()
                .run();
            },
          },
          {
            title: 'Code Block',
            icon: '/editor/code',
            command: (data: CommandData) => {
              data.editor
                .chain()
                .focus()
                .deleteRange(data.range)
                .setNode('codeBlock')
                .run();
            },
          },
          ...wdgts,
        ].filter((item) =>
          item.title.toLowerCase().startsWith(query.toLowerCase())
        );
      },
      render: () => {
        let _component: VueRenderer;
        let popup: Instance<Props>[];

        return {
          onStart: (_props: SuggestionProps) => {
            _component = new VueRenderer(CommandsList, {
              props: _props,
              editor: _props.editor,
            });

            popup = tippy('body', {
              getReferenceClientRect: _props.clientRect,
              appendTo: () => document.body,
              content: _component.element,
              showOnCreate: true,
              interactive: true,
              trigger: 'manual',
              placement: 'bottom-start',
            });
          },
          onUpdate(_props: any) {
            _component.updateProps(_props);

            popup[0].setProps({
              getReferenceClientRect: _props.clientRect,
            });
          },
          onKeyDown(_props: any) {
            if (_props.event.key === 'Escape') {
              popup[0].hide();

              return true;
            }
            return _component.ref?.onKeyDown(_props);
          },
          onExit() {
            popup[0].destroy();
            _component.destroy();
          },
        };
      },
    },
  } as any);
}

// export const BCMSSlashCommand = Extension.create({
//   name: 'mention',
//   defaultOptions: {
//     suggestion: {
//       char: '/',
//       startOfLine: true,
//       command: ({ editor, range, props }: any) => {
//         props.command({ editor, range });
//       },
//     },
//     test: 'Yo',
//   },

//   addProseMirrorPlugins() {
//     return [
//       Suggestion({
//         editor: this.editor,
//         ...this.options.suggestion,
//         bane: 'WTF',
//       } as any),
//     ];
//   },
// }).configure({
//   defaultOptions: {
//     bane: 'WOOO',
//   },
//   suggestion: {
//     bane: 'IIIIIIIIIIIIIIII',
//     async items(query: string) {
//       const store = window.bcms.sdk.store;
//       const widgets = store.getters.widget_items;

//       const headings = new Array(6).fill({}).map((_, index) => {
//         return {
//           title: `Heading ${index + 1}`,
//           icon: `/editor/heading/h${index + 1}`,
//           command: (data: CommandData) => {
//             data.editor
//               .chain()
//               .focus()
//               .deleteRange(data.range)
//               .setNode('heading', { level: index + 1 })
//               .run();
//           },
//         };
//       });

//       const wdgts: Array<SlashCommandItem> = [];

//       for (let i = 0; i < widgets.length; i++) {
//         const widget = widgets[i];
//         const values: BCMSPropValueExtended[] = [];
//         for (let j = 0; j < widget.props.length; j++) {
//           const prop = widget.props[j];
//           const propExtended = await window.bcms.prop.toPropValueExtended({
//             prop,
//           });

//           if (propExtended) {
//             values.push(propExtended);
//           }
//         }

//         wdgts.push({
//           title: `${widget.name}`,
//           widget: true,
//           icon: `/administration/widget`,
//           command: () => {
//             return (window.bcms.editor?.value as Editor).chain().setWidget({
//               widget,
//               content: values,
//             });
//           },
//         });
//       }

//       return [
//         ...headings,
//         {
//           title: 'Paragraph',
//           icon: '/editor/text',
//           command: (data: CommandData) => {
//             data.editor
//               .chain()
//               .focus()
//               .deleteRange(data.range)
//               .setNode('paragraph')
//               .run();
//           },
//         },
//         {
//           title: 'Bullet List',
//           icon: '/editor/list-ul',
//           command: (data: CommandData) => {
//             data.editor
//               .chain()
//               .focus()
//               .deleteRange(data.range)
//               .toggleBulletList()
//               .run();
//           },
//         },
//         {
//           title: 'Ordered List',
//           icon: '/editor/list-ol',
//           command: (data: CommandData) => {
//             data.editor
//               .chain()
//               .focus()
//               .deleteRange(data.range)
//               .toggleOrderedList()
//               .run();
//           },
//         },
//         {
//           title: 'Code Block',
//           icon: '/editor/code',
//           command: (data: CommandData) => {
//             data.editor
//               .chain()
//               .focus()
//               .deleteRange(data.range)
//               .setNode('codeBlock')
//               .run();
//           },
//         },
//         ...wdgts,
//       ].filter((item) =>
//         item.title.toLowerCase().startsWith(query.toLowerCase())
//       );
//     },
//     render: () => {
//       let _component: VueRenderer;
//       let popup: Instance<Props>[];

//       return {
//         onStart: (_props: SuggestionProps) => {
//           console.log('here', _props);
//           _component = new VueRenderer(CommandsList, {
//             props: _props,
//             editor: _props.editor,
//           });

//           popup = tippy('body', {
//             getReferenceClientRect: _props.clientRect,
//             appendTo: () => document.body,
//             content: _component.element,
//             showOnCreate: true,
//             interactive: true,
//             trigger: 'manual',
//             placement: 'bottom-start',
//           });
//         },
//         onUpdate(_props: any) {
//           _component.updateProps(_props);

//           popup[0].setProps({
//             getReferenceClientRect: _props.clientRect,
//           });
//         },
//         onKeyDown(_props: any) {
//           if (_props.event.key === 'Escape') {
//             popup[0].hide();

//             return true;
//           }
//           return _component.ref?.onKeyDown(_props);
//         },
//         onExit() {
//           popup[0].destroy();
//           _component.destroy();
//         },
//       };
//     },
//   },
// } as any);
