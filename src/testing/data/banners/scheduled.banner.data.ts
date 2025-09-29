import structuredClone from 'structured-clone';

const ScheduledBannerData = {
  data: {
    id: '',
    type: 'banners',
    attributes: {
      start_date: new Date('2025-09-01T00:00:00.000000Z'),
      end_date: new Date('2025-09-30T23:59:59.999999Z'),
      color: '#823e3e',
      license: 'none',
      link: 'http://www.google.com',
      name: 'test',
      default_alt_text: 'fafda',
      mobile_alt_text: 'afdsa',
    },
    links: {
      self: 'https://api.staging4.osf.io/_/banners/current/',
      default_photo: 'https://api.staging4.osf.io/_/banners/OSF_Banner_13.svg/',
      mobile_photo: 'https://api.staging4.osf.io/_/banners/OSF_Banner_13.svg/',
    },
  },
  meta: {
    version: '2.20',
  },
};

export function getScheduledBannerData() {
  return structuredClone(ScheduledBannerData);
}
