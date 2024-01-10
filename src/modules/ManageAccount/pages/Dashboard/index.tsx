import SrcIcons from '@/assets/icons';
import { appLibrary } from '@/shared/utils/loading';
import { Col, Row, Table, Tooltip, User } from '@nextui-org/react';
import { Input, Select } from 'antd';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { JOB_STATUS_OPTION } from '../../shared/constances';
import { JOBS_STATUS_NUMERIC } from '../../shared/enum';
import { TJobs } from '../../shared/types';

interface IProps {
  jobs: TJobs[];
}
const { Option } = Select;
const columns = [
  { name: 'DOANH NGHIỆP', uid: 'name' },
  { name: 'ĐẠI DIỆN', uid: 'represent' },
  { name: 'EMAIL', uid: 'email' },
  { name: 'TYPE', uid: 'plan' },
  { name: 'NGÀY TẠO', uid: 'created_at' },
  { name: 'TRẠNG THÁI', uid: 'status' },
  { name: 'THAO TÁC', uid: 'actions' },
];

export function ManageJobsDashBoard({ jobs }: IProps) {
  const [dataTable, setDataTable] = useState<TJobs[]>(jobs);
  const [openDinedPopUp, setOpenDinedPopUp] = useState(false);
  const toggle = (value) => {
    setOpenDinedPopUp(value);
  };

  const handleChangeState = (
    id: string | number,
    value: JOBS_STATUS_NUMERIC | string
  ) => {
    appLibrary.showloading();
    try {
      if (value === JOBS_STATUS_NUMERIC.REJECTED) {
        setOpenDinedPopUp(true);
      }
      appLibrary.hideloading();
    } catch (error) {
      appLibrary.hideloading();
      console.log(error.message);
    }
  };
  const renderCell = useMemo(
    // eslint-disable-next-line react/display-name
    () => (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
        case 'name':
          return <div className="text-[14px] font-semibold">{item.name}</div>;
        case 'represent':
          return (
            <User
              squared
              src={item?.avatar ?? SrcIcons.iconYouth}
              size="xl"
              name={item.represent}
            ></User>
          );
        case 'field':
          return (
            <Col>
              <Row>
                <span className="text-[14px]">{item.field}</span>
              </Row>
            </Col>
          );
        case 'status':
          return (
            <Select
              placeholder="Chọn giới tính"
              size="large"
              defaultValue={JOBS_STATUS_NUMERIC[item.status]}
              bordered={false}
              className="border-[2px] border-solid  border-gray-300 text-gray-900 text-sm rounded-lg focus:border-[#22216D] block w-full"
              onChange={(value) => {
                handleChangeState(item.id, value);
              }}
            >
              {JOB_STATUS_OPTION.map((item) => (
                <Option value={item.value}>{item.label}</Option>
              ))}
            </Select>
            // <CustomSelector
            //   wrapperClassName="w-[200px] mb-0 "
            //   onChange={(value) => {
            //     handleChangeState(item.id, value);
            //   }}
            //   initialValue={JOBS_STATUS_NUMERIC[item.status]}
            //   options={[
            //     {
            //       key: 0,
            //       value: JOBS_STATUS_NUMERIC.APPROVED,
            //       label: JOBS_STATUS.APPROVED,
            //     },
            //     {
            //       key: 1,
            //       value: JOBS_STATUS_NUMERIC.PENDING,
            //       label: JOBS_STATUS.PENDING,
            //     },
            //     {
            //       key: 2,
            //       value: JOBS_STATUS_NUMERIC.REJECTED,
            //       label: JOBS_STATUS.REJECTED,
            //     },
            //   ]}
            // />
          );
        case 'actions':
          return (
            <Row className="ml-[30px]">
              <Tooltip content="Sửa">
                <Link
                  href={`/quan-ly-viec-lam/danh-sach/chinh-sua/${item.id}`}
                  legacyBehavior
                >
                  <Image src={SrcIcons.seeDetail} height={30} width={30} alt="icon" />
                </Link>
              </Tooltip>
            </Row>
          );
        default:
          return cellValue;
      }
    },
    []
  );
  const handleSearch = () => {};

  const onSearch = (event) => {
    const { value } = event.target;
    handleSearch();
  };
  return (
    <>
      <div className="flex mb-[1rem] gap-3">
        <Input
          size="large"
          placeholder="Tìm kiếm nghề "
          className="rounded-[10px] bg-white"
          allowClear
          onChange={onSearch}
          prefix={<Image src={SrcIcons.searchIcon} width={18} height={18} alt="icon" />}
        />
      </div>
      <Table
        selectionMode="none"
        lang="vi"
        sticked={false}
        lined
        aria-label="Danh sách bài test"
        aria-labelledby="Danh sách bài test"
        css={{ background: 'white', height: 'auto', minWidth: '100%' }}
        striped
        color="secondary"
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column
              key={column.uid}
              align={'start'}
              allowsSorting={column.uid !== 'actions' && column.uid !== 'published'}
            >
              {column.name}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={dataTable}>
          {(item) => (
            <Table.Row>
              {(columnKey) => <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>}
            </Table.Row>
          )}
        </Table.Body>
        <Table.Pagination
          noMargin
          align="center"
          rowsPerPage={7}
          onPageChange={(page) => console.log({ page })}
        />
      </Table>
    </>
  );
}
