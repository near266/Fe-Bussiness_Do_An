import city from '@/assets/address/cities.json';
import district from '@/assets/address/districts.json';
import ward from '@/assets/address/wards.json';
class AdressAPI {
  async getCity() {
    return city;
  }
  async getDistrict() {
    return district;
  }
  async FindDistrictByCity(value) {
    const res = district.filter((x) => x.parent === value);
    return res;
  }
  async FindWardByDitrict(value) {
    const res = ward.filter((x) => x.parent === value);
    return res;
  }
}

export const adressAPI = new AdressAPI();
