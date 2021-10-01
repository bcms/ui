<script lang="tsx">
import { defineComponent, ref } from 'vue';
import { BCMSIcon } from '..';
import Modal from './_modal.vue';

const component = defineComponent({
  setup() {
    const show = ref(false);
    const activeViewIndex = ref(0);

    window.bcms.modal.showDescriptionExample = {
      hide() {
        show.value = false;
      },
      show() {
        show.value = true;
      },
    };

    // TODO: Add BCMS-related content describing use-cases and how to use description in general
    const views = [
      {
        button: {
          title: 'Team Space',
          desc: 'A virtual gathering place for your team',
          icon: '/cog',
        },
        preview: {
          img: '/assets/components/modals/show-description-example/1.png',
          bgColor: '#249681',
        },
      },
      {
        button: {
          title: 'Project Space',
          desc: 'Coordinate project work in one place',
          icon: '/cog',
        },
        preview: {
          img: '/assets/components/modals/show-description-example/2.png',
          bgColor: '#f56b58',
        },
      },
      {
        button: {
          title: 'Personal Space',
          desc: 'A space for your own stuff',
          icon: '/cog',
        },
        preview: {
          img: '/assets/components/modals/show-description-example/3.png',
          bgColor: '#ecada9',
        },
      },
    ];

    function cancel() {
      window.bcms.modal.showDescriptionExample.hide();
    }
    function done() {
      window.bcms.modal.showDescriptionExample.hide();
    }

    return () => (
      <Modal
        class="bcmsModal_showDescriptionExampleModal"
        onCancel={cancel}
        onDone={done}
        show={show.value}
        doNotShowFooter={true}
      >
        <div class="bcmsModal_showDescriptionExampleModal--buttons">
          <div class="bcmsModal_showDescriptionExampleModal--title">
            Overview examples to inspire you
          </div>
          {views.map((view, index) => {
            return (
              <button
                class={`bcmsModal_showDescriptionExampleModal--button ${
                  activeViewIndex.value === index
                    ? 'bcmsModal_showDescriptionExampleModal--button_active'
                    : ''
                }`}
                key={index}
                onClick={() => {
                  activeViewIndex.value = index;
                }}
              >
                <BCMSIcon src={view.button.icon} />
                <div class="bcmsModal_showDescriptionExampleModal--button-text">
                  <p class="bcmsModal_showDescriptionExampleModal--button-title">
                    {view.button.title}
                  </p>
                  <p class="bcmsModal_showDescriptionExampleModal--button-desc">
                    {view.button.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
        <div
          class="bcmsModal_showDescriptionExampleModal--preview"
          style={{
            backgroundColor: views[activeViewIndex.value].preview.bgColor,
          }}
        >
          <img
            src={views[activeViewIndex.value].preview.img}
            alt="Preview image"
          />
        </div>
      </Modal>
    );
  },
});
export default component;
</script>
