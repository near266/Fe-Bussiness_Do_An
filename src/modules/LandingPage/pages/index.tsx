import SrcIcons from '@/assets/icons';
import SrcImages from '@/assets/images';
import Image from 'next/legacy/image';
import Link from 'next/link';

const HeroSection: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 items-center sm:grid-cols-2 px-5 xl:px-0 flex-wrap">
        <div className="hero-content min-w-[320px]">
          <div className="flex flex-col items-start gap-3 max-w-[622px]">
            <h1 className="font-semibold text-[#22216D] text-[24px] sm:text-[30px] md:text-[32px] lg:text-[40px] leading-[28px] sm:leading-[30px] md:leading-[43px] lg:leading-[48px] -tracking-[0.005em]">
              Youth+ Nền tảng định hướng
              <br /> và kết nối làm việc cho giới trẻ
            </h1>
            <p className="font-normal text-[16px] sm:text-[18px] md:text-[20px] leading-[24px] md:leading-7 text-[#44444F] mb-[32px]">
              Kết nối triệu ứng viên ưng ý - Tuyển dụng ngay nhân tài đúng ý cùng YOUTH+
            </p>
            <Link href="/sign-up">
              <button className="primary-button !mt-auto !mx-0">Tham gia ngay</button>
            </Link>
          </div>
        </div>
        <div className="hero-image relative w-full h-full min-h-[320px] min-w-[320px]  md:h-[428px] ml-auto md:w-[352px]">
          <Image
            layout="fill"
            objectFit="contain"
            alt="Youth+ Doanh nghiệp"
            src={SrcImages.heroLogo}
            priority
            quality={100}
          />
        </div>
      </div>
      <img
        className="bounce  cursor-pointer relative bottom-[-80px] md:!bottom-0 h-10 left-1/2"
        src={SrcIcons.bounceArrow}
        alt="bounce"
      />
    </>
  );
};
const ServicesSection: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 items-center sm:grid-cols-2 my-5 px-5 xl:px-0">
        <div className="services-image relative w-full h-[650px] min-w-[320px]">
          <Image
            layout="fill"
            objectFit="contain"
            alt="Youth+ Doanh nghiệp"
            src={SrcImages.services}
            priority
            quality={100}
          />
        </div>
        <div className="services-content">
          <div className="flex flex-col items-start gap-3 max-w-[622px]">
            <h1 className="font-semibold text-[#22216D] text-[40px] leading-[48px] -tracking-[0.005em]">
              Dịch vụ
            </h1>
            <p className="font-normal text-[16px] sm:text-[18px] md:text-[20px] leading-[24px] md:leading-7 text-[#44444F] mb-[32px]">
              YOUTH+ - Mang đến cho bạn dịch vụ tuyển dụng chất lượng và đáng tin cậy
            </p>
            <div className="card !py-5 flex gap-3">
              <Image
                width={37}
                height={37}
                src={SrcIcons.timer}
                alt="Youth+ Doanh nghiệp"
                priority
                quality={100}
              />
              <div>
                <p className="typo-h2 !text-[18px]">Tuyển dụng nhanh chóng</p>
                <span className="typo-normal text-[#696974]">
                  Hệ thống cung cấp <strong>+800 ứng viên</strong> tiềm năng, sẵn sàng
                  nhận việc
                </span>
              </div>
            </div>
            <div className="card !py-5 flex gap-3">
              <Image
                width={37}
                height={37}
                alt="Youth+ Doanh nghiệp"
                src={SrcIcons.timer}
                priority
                quality={100}
              />
              <div>
                <p className="typo-h2 !text-[18px]">Dữ liệu chính xác</p>
                <span className="typo-normal text-[#696974]">
                  Hệ thống cung cấp <strong>+800 ứng viên</strong> tiềm năng, sẵn sàng
                  nhận việc
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="services-footer  bg-[#22216D] h-[300px] w-full mb-[50px]">
        <div className="absolute inset-x-full bg-transparent bg-[url('/images/section-bg.svg')] w-full h-[300px] left-0 xl:max-w-[1900px] xl:left-1/2 xl:-translate-x-1/2"></div>
        <div className="relative pt-[70px] pb-[30px]">
          <div className="flex justify-center items-center flex-col gap-4">
            <h4 className="text-white font-semibold text-[20px] leading-10">
              Bạn đã sẵn sàng để chọn nhân tài về cho công ty?
            </h4>
            <button className="primary-button !mt-auto !mx-0">Tham gia ngay</button>
          </div>
        </div>
      </div>
    </>
  );
};
const PartnerSection: React.FC = () => {
  const partners = [
    {
      id: 26,
      name: 'CSDS',
      imageUrl: SrcImages.csdsLogo,
      desc: 'Trung tâm nghiên cứu phát triển bền vững - Bảo vệ pháp lý',
    },
    {
      id: 52,
      name: 'JCI Vietnam',
      imageUrl: SrcImages.jciLogo,
      desc: 'Liên đoàn lãnh đạo và Doanh nhân trẻ Thế giới',
    },
    {
      id: 40,
      name: 'Hội sinh viên',
      imageUrl: SrcImages.hoisinhvienvnLogo,
      desc: 'Hội sinh viên Đại học Xây Dựng',
    },

    {
      id: 56,
      name: 'Google',
      imageUrl: SrcImages.googleLogo,
      desc: 'Google Việt Nam',
    },
    {
      id: 33,
      name: 'VNPAY',
      imageUrl: SrcImages.vnpayLogo,
      desc: 'Công ty cổ phần giải pháp thanh toán Việt Nam',
    },
    {
      id: 27,
      name: 'FIIS',
      imageUrl: SrcImages.fiisLogo,
      desc: 'Trung tâm sáng tạo và ươm tạo FTU',
    },
    {
      id: 184,
      name: 'CSDS',
      imageUrl: SrcImages.csdsLogo,
      desc: 'Trung tâm nghiên cứu phát triển bền vững - Bảo vệ pháp lý',
    },
    {
      id: 126,
      name: 'JCI Vietnam',
      imageUrl: SrcImages.jciLogo,
      desc: 'Liên đoàn lãnh đạo và Doanh nhân trẻ Thế giới',
    },
    {
      id: 185,
      name: 'Hội sinh viên',
      imageUrl: SrcImages.hoisinhvienvnLogo,
      desc: 'Hội sinh viên Đại học Xây Dựng',
    },

    {
      id: 179,
      name: 'Google',
      imageUrl: SrcImages.googleLogo,
      desc: 'Google Việt Nam',
    },
    {
      id: 134,
      name: 'VNPAY',
      imageUrl: SrcImages.vnpayLogo,
      desc: 'Công ty cổ phần giải pháp thanh toán Việt Nam',
    },
    {
      id: 180,
      name: 'FIIS',
      imageUrl: SrcImages.fiisLogo,
      desc: 'Trung tâm sáng tạo và ươm tạo FTU',
    },
  ];
  return (
    <>
      <div className="flex justify-center items-center flex-col gap-8 overflow-hidden">
        <h3 className="font-semibold text-[#22216D] text-[40px] leading-[48px] -tracking-[0.005em] ">
          Đối tác
        </h3>
        <div
          className={
            'hide_scrollbar flex  flex-nowrap animate-[scroll-infinity_10s_linear_infinite] h-full left-0 overflow-visible relative w-full hover:pause'
          }
        >
          {partners.map((item, index) => (
            <div key={item.id} className={'min-w-[300px] h-40 mx-auto'}>
              <img src={item.imageUrl} alt={item.name} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
const ContactInfoSection: React.FC = () => {
  const contac = [
    { name: 'Nguyễn Thị Hồng Hạnh', phoneNumber: '0354 232 014' },
    { name: 'Mai Phương Linh', phoneNumber: '0966 391 705' },
    { name: 'Nguyễn Thị Lan Hương', phoneNumber: '0984 259 428' },
    { name: 'Cao Thị Hòa', phoneNumber: '0332 468 266' },
    { name: 'Trần Thúy Hồng', phoneNumber: '0971 421 941' },
  ];
  return (
    <>
      <div className="absolute inset-x-full bg-white w-full h-[485px] left-0 xl:max-w-[1900px] xl:left-1/2 xl:-translate-x-1/2 -z-[1]"></div>
      <div className="grid bg-white grid-cols-1 items-center sm:grid-cols-2 px-5 xl:px-0 flex-wrap py-5">
        <div className="hero-content min-w-[320px]">
          <div className="flex flex-col items-start gap-3 max-w-[622px]">
            <div className="w-full relative">
              <p className="font-[600] leading-[26px] text-[#F4BF59] text-center before:h-[1px] before:w-[117px] before:absolute before:bg-[#F4BF59] before:top-[65%] before:-translate-x-[calc(100%+10px)]">
                HỖ TRỢ VÀ TƯ VẤN
              </p>
            </div>
            <h1 className="font-semibold text-[#22216D] text-[24px] sm:text-[30px] md:text-[32px] lg:text-[40px] leading-[28px] sm:leading-[30px] md:leading-[43px] lg:leading-[48px] -tracking-[0.005em]">
              Youth+ mong muốn được hợp tác với doanh nghiệp
            </h1>
            <p className="font-normal text-[14px] sm:text-[16px] md:text-[20px] leading-[24px] md:leading-7 text-[#44444F] ">
              Đội ngũ hỗ trợ của Youth+ luôn sẵn sàng để tư vấn giải pháp tuyển dụng và
              đồng hành cùng quý các nhà tuyển dụng
            </p>
            <ul className="list-disc translate-x-6 mb-[32px]">
              {contac.map((item, index) => (
                <li
                  key={`${item.name + index}`}
                  className="text-[18px] leading-[24px] text-[#44444F]"
                >
                  <strong className="text-[#403ECC]">{item.phoneNumber}</strong> -&nbsp;
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="hero-image relative h-full min-h-[442.84px] min-w-[320px]  md:h-[428px] ml-auto w-full">
          <Image
            layout="fill"
            objectFit="contain"
            alt="Youth+ Doanh nghiệp"
            src={SrcImages.contactInfo}
            priority
            quality={100}
          />
        </div>
      </div>
    </>
  );
};
const HomeModule = () => {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <PartnerSection />
      <ContactInfoSection />
    </>
  );
};

export default HomeModule;
