import SrcIcons from '@/assets/icons';
import { IconButton } from '@/components/IconButton';
import { Row, Table, Tooltip, User } from '@nextui-org/react';
import Image from 'next/legacy/image';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { RecruitmentForm } from '../../../ManageRecruitment/components/RecruitmentForm';

export interface IProps {
  news: TCV;
}

const columns = [
  { name: 'ỨNG VIÊN', uid: 'name' },
  { name: 'THỜI GIAN', uid: 'created_at' },
  { name: 'THAO TÁC', uid: 'actions' },
];

type TCV = {
  id: string | number;
  name: string;
  avatar: string;
  created_at: string;
};

const sample = [
  {
    id: 0,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: Date.now.toString,
  },
  {
    id: 1,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: Date.now.toString,
  },
  {
    id: 2,
    name: 'Doanh nghiep 1',
    avatar: 'http://cisif.do/ibi',
    created_at: Date.now.toString,
  },
];

export function Resume(props) {
  const router = useRouter();
  const [openDetail, setOpenDetail] = useState(false);
  const toggle = () => setOpenDetail((active) => !active);
  const {
    query: { id },
  } = router;
  console.log(id);
  const [dataTable, setDataTable] = useState(sample);
  const renderCell = useMemo(
    // eslint-disable-next-line react/display-name
    () => (item: any, columnKey: React.Key) => {
      const cellValue = item[columnKey];
      switch (columnKey) {
        case 'name':
          return (
            <div className="flex">
              <User
                squared
                src={item?.avatar ?? SrcIcons.iconYouth}
                size="xl"
                name={item.name}
              ></User>
              <IconButton>
                <Image
                  src={SrcIcons.ic_link}
                  width={24}
                  height={24}
                  alt="Youth+ Doanh nghiệp"
                />
              </IconButton>
            </div>
          );

        case 'actions':
          return (
            <Row className="ml-[30px] gap-2">
              <Tooltip content="Sửa">
                <IconButton
                  onClick={(value) => {
                    setOpenDetail(true);
                    console.log(value);
                  }}
                >
                  <Image
                    src={SrcIcons.editActionIcon}
                    height={30}
                    width={30}
                    alt="Youth+ Doanh nghiệp"
                  />
                </IconButton>
              </Tooltip>

              <Tooltip content="Xóa">
                <IconButton>
                  <Image
                    src={SrcIcons.deleteActionIcon}
                    height={30}
                    width={30}
                    alt="Youth+ Doanh nghiệp"
                  />
                </IconButton>
              </Tooltip>
            </Row>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  if (openDetail) {
    return <RecruitmentForm />;
  }
  return (
    <>
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
