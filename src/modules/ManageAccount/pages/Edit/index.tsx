import { IEnterprise } from '@/interfaces/models/IEnterprise';
import { IRepresent } from '@/interfaces/models/IRepresent';
import { Tabs } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { AccountInfoForm } from '../../components/AccountInfo';
import { CompanyInfoForm } from '../../components/CompanyInfo';
import { LicenseForm } from '../../components/License';
interface IProps {
  account: IRepresent;
  company: IEnterprise;
}

export function EditJobsModule({ account, company }: IProps) {
  const tabs = [
    {
      key: 1,
      tab: <AccountInfoForm accountInfo={account} />,
      name: 'Thông tin tài khoản',
    },
    { key: 2, tab: <CompanyInfoForm company={company} />, name: 'Thông tin công ty' },
    { key: 3, tab: <LicenseForm />, name: 'Giấy phép kinh doanh' },
  ];

  const [currentTabs, setCurrentTabs] = useState(tabs[0].key);
  const router = useRouter();

  return (
    <div className="company-info card bg-white px-8 py-6 editjob">
      <Tabs
        defaultActiveKey="1"
        onChange={(value) => {
          setCurrentTabs(parseInt(value));
        }}
      >
        {tabs.map((item) => (
          <Tabs.TabPane tab={item.name} key={item.key}>
            {item.tab}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
}
