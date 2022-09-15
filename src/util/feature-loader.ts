import { BCMSFeature, BCMSStoreMutationTypes } from '../types';

export async function bcmsFeatureLoader(
  forceAvailable?: string[]
): Promise<void> {
  // TODO: Load features from an API.
  const features: BCMSFeature[] = [];

  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    if (forceAvailable?.includes(feature.name)) {
      feature.available = true;
    }
  }

  window.bcms.vue.store.commit(BCMSStoreMutationTypes.feature_set, features);
}
