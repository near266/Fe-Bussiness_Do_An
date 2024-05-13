import { DetailEnterprise, accountAPI } from '@/modules/ManageAccount/shared/api';
import { SearchPost, recruitmentsAPI } from '@/modules/ManageRecruitment/shared/api';
import { Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ListPost = () => {
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const data = useSelector((state: any) => state.login.data);
  const [currentAccountInfo, setCurrentAccountInfo] = useState<any>({});
  const [page, setPage] = useState<any>(1);
  const [pageSize, setPageSize] = useState<any>(10);

  const payload: DetailEnterprise = {
    id: data.id,
  };
  const Enterprise = async () => {
    const user = await accountAPI.getEnterpriseById(payload);

    setCurrentAccountInfo(user);
    const defaultPayload: SearchPost = {
      enterprise_id: user.id,
      page: page,
      pageSize: pageSize,
    };
    const AllPost = await recruitmentsAPI.getAllPost(defaultPayload);
    setDataSource(AllPost.items);
    console.log(AllPost);
  };
  useEffect(() => {
    Enterprise();
  }, []);
  return (
    <div>
      <Table columns={columns} dataSource={dataSource}></Table>
    </div>
  );
};

export default ListPost;
