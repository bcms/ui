<script lang="tsx">
import { defineComponent, reactive, ref, Transition } from 'vue';
import { useI18n } from 'vue-i18n';
import BCMSIcon from '../icon.vue';
import { DefaultComponentProps } from '../_default';

const component = defineComponent({
  props: {
    ...DefaultComponentProps,
  },
  emits: {
    click: () => {
      return true;
    },
  },
  setup(props, ctx) {
    props = reactive(props);
    const { t: i18n } = useI18n();
    const helpContainer = ref<HTMLDivElement | null>(null);
    const show = ref(false);
    const toggler = ref<HTMLButtonElement | null>(null);

    function handleClick() {
      if (!show.value) {
        show.value = true;
      } else {
        show.value = false;
      }
    }

    return () => {
      return (
        <div class={`help relative ${props.class || ''}`} v-cy={props.cyTag}>
          <button
            onClick={() => {
              handleClick();
              ctx.emit('click');
            }}
            class="help--btn group w-8 h-8 flex items-center justify-center rounded-full text-lg bg-white transition-all duration-200 z-1000"
            title={i18n('footer.help.toggleTitle')}
            ref={toggler}
          >
            <span class="font-medium text-dark text-opacity-75 pointer-events-none transition-colors duration-200 group-hover:text-green group-focus:text-green">
              ?
            </span>
          </button>
          <Transition name="fade">
            {show.value === true && (
              <div
                class="help--container absolute top-0 left-0 -translate-x-full -translate-y-full min-w-max bg-white rounded-2.5 py-1.5"
                ref={helpContainer}
                v-clickOutside={() => (show.value = false)}
              >
                <button class="group text-dark py-1.5 px-3.5 w-full text-left no-underline flex items-center transition-colors duration-300 hover:text-green focus:text-green hover:bg-light focus:bg-light">
                  <BCMSIcon
                    src="/file"
                    class="text-dark text-opacity-80 fill-current w-4 mr-1.5 h-auto mb-0.5 transition-colors duration-300 group-hover:text-green group-focus:text-green"
                  />
                  <span>{i18n('footer.help.support')}</span>
                </button>
                <button class="group text-dark py-1.5 px-3.5 w-full text-left no-underline flex items-center transition-colors duration-300 hover:text-green focus:text-green hover:bg-light focus:bg-light">
                  <BCMSIcon
                    src="/file"
                    class="text-dark text-opacity-80 fill-current w-4 mr-1.5 h-auto mb-0.5 transition-colors duration-300 group-hover:text-green group-focus:text-green"
                  />
                  <span>{i18n('footer.help.messages')}</span>
                </button>
                <div class="h-px my-0.5 bg-grey bg-opacity-30" />
                <button class="text-dark py-1.5 px-3.5 w-full text-left no-underline flex items-center transition-colors duration-300 hover:text-green focus:text-green hover:bg-light focus:bg-light">
                  {i18n('footer.help.shortcuts')}
                </button>
                <button class="text-dark py-1.5 px-3.5 w-full text-left no-underline flex items-center transition-colors duration-300 hover:text-green focus:text-green hover:bg-light focus:bg-light">
                  {i18n('footer.help.new')}
                </button>
                <button class="text-dark py-1.5 px-3.5 w-full text-left no-underline flex items-center transition-colors duration-300 hover:text-green focus:text-green hover:bg-light focus:bg-light">
                  {i18n('footer.help.join')}
                </button>
                <div class="h-px my-0.5 bg-grey bg-opacity-30" />
                <a
                  href="https://twitter.com/thebcms"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-dark text-opacity-50 font-medium py-1.5 px-3.5 w-full text-left no-underline flex items-center transition-colors duration-300 hover:text-green focus:text-green hover:bg-light focus:bg-light"
                  onClick={handleClick}
                >
                  Twitter - @thebcms
                </a>
                <button class="text-dark text-opacity-50 font-medium py-1.5 px-3.5 w-full text-left no-underline flex items-center transition-colors duration-300 hover:text-green focus:text-green hover:bg-light focus:bg-light">
                  {i18n('footer.help.terms')}
                </button>
                <button class="text-dark text-opacity-50 font-medium py-1.5 px-3.5 w-full text-left no-underline flex items-center transition-colors duration-300 hover:text-green focus:text-green hover:bg-light focus:bg-light">
                  {i18n('footer.help.status')}
                </button>
                <div class="h-px my-0.5 bg-grey bg-opacity-30" />
                <div class="text-dark text-opacity-50 font-normal mt-1.5 py-0 px-3.5 w-full text-sm text-left no-underline flex items-center">
                  {i18n('footer.help.version')}
                </div>
                <div class="text-dark text-opacity-50 font-normal mt-1.5 py-0 px-3.5 w-full text-sm text-left no-underline flex items-center">
                  {i18n('footer.help.updatedAt', { date: '2 days' })}
                </div>
              </div>
            )}
          </Transition>
        </div>
      );
    };
  },
});
export default component;
</script>
