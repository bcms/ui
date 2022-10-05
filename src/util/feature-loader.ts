import { BCMSFeature, BCMSStoreMutationTypes } from '../types';

export async function bcmsFeatureLoader(
  forceAvailable?: string[]
): Promise<void> {
  try {
    const res = await fetch('https://cloud.thebcms.com/api/v1/feature/all');
    const features: BCMSFeature[] = (await res.json()).items;

    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      if (forceAvailable?.includes(feature.name)) {
        feature.available = 'true';
      }
    }

    window.bcms.vue.store.commit(BCMSStoreMutationTypes.feature_set, features);
  } catch (error) {
    console.error(error);
  }
}
