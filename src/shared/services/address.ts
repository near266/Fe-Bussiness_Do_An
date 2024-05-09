import city from '@/assets/address/cities.json';
import district from '@/assets/address/districts.json';
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
}
export const adressAPI = new AdressAPI();
