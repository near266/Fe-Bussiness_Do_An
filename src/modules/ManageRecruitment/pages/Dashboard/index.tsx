// import SrcIcons from '@/assets/icons';
// import { IconButton } from '@/components/IconButton';
// import {
//   ApproveStatusId,
//   IRecruitment,
//   StatusId,
// } from '@/interfaces/models/IRecruitment';
// import { SV_RES_STATUS_CODE } from '@/shared/enums/enums';
// import { showResponseError } from '@/shared/utils/common';
// import { appLibrary } from '@/shared/utils/loading';
// import { Checkbox, Col, Row, Table, Tooltip, User } from '@nextui-org/react';
// import { Input, message, Popconfirm } from 'antd';
// import moment from 'moment';
// import Image from 'next/image';
// import { useRouter } from 'next/router';
// import { useMemo, useState } from 'react';
// import { recruitmentsAPI } from '../../shared/api';
// import { debounce } from 'lodash-es';
// import { Common } from '@/shared/utils';

// export const ApproveStatusIdSVG = {
//   [ApproveStatusId.APPROVED]: (
//     <svg
//       width="32"
//       height="32"
//       viewBox="0 0 32 32"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         fill-rule="evenodd"
//         clip-rule="evenodd"
//         d="M16.0003 5.33329C13.3973 5.33329 10.9979 5.54797 9.07193 5.80233C7.33862 6.03124 6.03161 7.33826 5.80269 9.07157C5.54833 10.9975 5.33366 13.397 5.33366 16C5.33366 18.6029 5.54833 21.0024 5.80269 22.9284C6.03161 24.6617 7.33862 25.9687 9.07193 26.1976C10.9979 26.452 13.3973 26.6666 16.0003 26.6666C18.6033 26.6666 21.0028 26.452 22.9287 26.1976C24.662 25.9687 25.969 24.6617 26.198 22.9284C26.4523 21.0024 26.667 18.6029 26.667 16C26.667 13.397 26.4523 10.9975 26.198 9.07157C25.969 7.33826 24.662 6.03124 22.9287 5.80233C21.0028 5.54797 18.6033 5.33329 16.0003 5.33329ZM8.72278 3.15862C5.79372 3.54546 3.54582 5.79335 3.15898 8.72241C2.89304 10.7361 2.66699 13.255 2.66699 16C2.66699 18.7449 2.89304 21.2638 3.15898 23.2775C3.54582 26.2066 5.79372 28.4545 8.72278 28.8413C10.7364 29.1072 13.2554 29.3333 16.0003 29.3333C18.7453 29.3333 21.2642 29.1072 23.2779 28.8413C26.2069 28.4545 28.4548 26.2066 28.8417 23.2775C29.1076 21.2639 29.3337 18.7449 29.3337 16C29.3337 13.255 29.1076 10.7361 28.8417 8.72241C28.4548 5.79335 26.2069 3.54546 23.2779 3.15862C21.2642 2.89267 18.7453 2.66663 16.0003 2.66663C13.2554 2.66663 10.7364 2.89267 8.72278 3.15862Z"
//         fill="#30AB7E"
//       />
//       <path
//         d="M9.60059 15.9999L13.8673 20.2666L22.4006 11.7333"
//         stroke="#30AB7E"
//         stroke-width="2"
//         stroke-miterlimit="10"
//         stroke-linecap="round"
//         stroke-linejoin="round"
//       />
//     </svg>
//   ),
//   [ApproveStatusId.REJECTED]: (
//     <svg
//       width="28"
//       height="28"
//       viewBox="0 0 28 28"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         fill-rule="evenodd"
//         clip-rule="evenodd"
//         d="M14.0003 3.33329C11.3973 3.33329 8.99788 3.54797 7.07193 3.80233C5.33862 4.03124 4.03161 5.33826 3.80269 7.07157C3.54833 8.99751 3.33366 11.397 3.33366 14C3.33366 16.6029 3.54833 19.0024 3.80269 20.9284C4.03161 22.6617 5.33862 23.9687 7.07193 24.1976C8.99788 24.452 11.3973 24.6666 14.0003 24.6666C16.6033 24.6666 19.0028 24.452 20.9287 24.1976C22.662 23.9687 23.969 22.6617 24.198 20.9284C24.4523 19.0024 24.667 16.6029 24.667 14C24.667 11.397 24.4523 8.99751 24.198 7.07157C23.969 5.33826 22.662 4.03124 20.9287 3.80233C19.0028 3.54797 16.6033 3.33329 14.0003 3.33329ZM6.72278 1.15862C3.79372 1.54546 1.54582 3.79335 1.15898 6.72241C0.893038 8.73607 0.666992 11.255 0.666992 14C0.666992 16.7449 0.893038 19.2638 1.15898 21.2775C1.54582 24.2066 3.79372 26.4545 6.72278 26.8413C8.73643 27.1072 11.2554 27.3333 14.0003 27.3333C16.7453 27.3333 19.2642 27.1072 21.2779 26.8413C24.2069 26.4545 26.4548 24.2066 26.8417 21.2775C27.1076 19.2639 27.3337 16.7449 27.3337 14C27.3337 11.255 27.1076 8.73607 26.8417 6.72241C26.4548 3.79335 24.2069 1.54546 21.2779 1.15862C19.2642 0.892671 16.7453 0.666626 14.0003 0.666626C11.2554 0.666626 8.73644 0.892671 6.72278 1.15862Z"
//         fill="#EB4C4C"
//       />
//     </svg>
//   ),
//   [ApproveStatusId.PENDING]: (
//     <svg
//       width="32"
//       height="32"
//       viewBox="0 0 32 32"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <g clip-path="url(#clip0_5893_800)">
//         <path
//           d="M16.0003 2.66663C15.2639 2.66663 14.667 3.26358 14.667 3.99996V7.99996C14.667 8.73634 15.2639 9.33329 16.0003 9.33329C16.7367 9.33329 17.3337 8.73634 17.3337 7.99996V3.99996C17.3337 3.26358 16.7367 2.66663 16.0003 2.66663Z"
//           fill="#3BB1CF"
//         />
//         <path
//           d="M16.0003 22.6666C15.2639 22.6666 14.667 23.2636 14.667 24V28C14.667 28.7363 15.2639 29.3333 16.0003 29.3333C16.7367 29.3333 17.3337 28.7363 17.3337 28V24C17.3337 23.2636 16.7367 22.6666 16.0003 22.6666Z"
//           fill="#3BB1CF"
//         />
//         <path
//           d="M28.0003 14.6666C28.7367 14.6666 29.3337 15.2636 29.3337 16C29.3337 16.7363 28.7367 17.3333 28.0003 17.3333H24.0003C23.2639 17.3333 22.667 16.7363 22.667 16C22.667 15.2636 23.2639 14.6666 24.0003 14.6666H28.0003Z"
//           fill="#3BB1CF"
//         />
//         <path
//           d="M9.33366 16C9.33366 15.2636 8.73671 14.6666 8.00033 14.6666H4.00033C3.26395 14.6666 2.66699 15.2636 2.66699 16C2.66699 16.7363 3.26395 17.3333 4.00033 17.3333H8.00033C8.73671 17.3333 9.33366 16.7363 9.33366 16Z"
//           fill="#3BB1CF"
//         />
//         <path
//           d="M23.5429 6.572C24.0636 6.0513 24.9078 6.0513 25.4285 6.572C25.9492 7.0927 25.9492 7.93692 25.4285 8.45762L22.6001 11.286C22.0794 11.8067 21.2351 11.8067 20.7144 11.286C20.1937 10.7653 20.1937 9.92113 20.7144 9.40043L23.5429 6.572Z"
//           fill="#3BB1CF"
//         />
//         <path
//           d="M11.2862 20.7139C10.7655 20.1932 9.92131 20.1932 9.40062 20.7139L6.57219 23.5424C6.05149 24.0631 6.05149 24.9073 6.57219 25.428C7.09289 25.9487 7.93711 25.9487 8.45781 25.428L11.2862 22.5995C11.8069 22.0788 11.8069 21.2346 11.2862 20.7139Z"
//           fill="#3BB1CF"
//         />
//         <path
//           d="M25.4284 23.5425C25.9491 24.0632 25.9491 24.9074 25.4284 25.4281C24.9077 25.9488 24.0635 25.9488 23.5428 25.4281L20.7144 22.5997C20.1937 22.079 20.1937 21.2348 20.7144 20.7141C21.2351 20.1934 22.0793 20.1934 22.6 20.7141L25.4284 23.5425Z"
//           fill="#3BB1CF"
//         />
//         <path
//           d="M11.2864 11.2859C11.8071 10.7652 11.8071 9.92095 11.2864 9.40025L8.45793 6.57182C7.93723 6.05112 7.09301 6.05112 6.57231 6.57182C6.05161 7.09252 6.05161 7.93674 6.57231 8.45744L9.40074 11.2859C9.92144 11.8066 10.7657 11.8066 11.2864 11.2859Z"
//           fill="#3BB1CF"
//         />
//       </g>
//       <defs>
//         <clipPath id="clip0_5893_800">
//           <rect width="32" height="32" fill="white" />
//         </clipPath>
//       </defs>
//     </svg>
//   ),
// };

// const columns = [
//   { name: 'TÊN TIN TUYỂN', uid: 'name' },
//   { name: 'SL ỨNG TUYỂN', uid: 'applicant_count' },
//   { name: 'LƯỢT XEM', uid: 'view_count' },
//   { name: 'THỜI GIAN', uid: 'created_at' },
//   { name: 'THAO TÁC', uid: 'actions' },
//   { name: 'TRẠNG THÁI', uid: 'status' },
//   { name: 'XUẤT BẢN', uid: 'published' },
// ];
// const RecruitmentDashboard = () => {
//   const router = useRouter();
//   const [dataTable, setDataTable] = useState<IRecruitment[]>();
//   const [filteredData, setFilteredData] = useState<IRecruitment[]>();

//   const handleDeleteRecruitment = (id: string) => {
//     if (id) {
//       return onDeleteRecruitment(id);
//     }
//   };

//   const onDeleteRecruitment = async (id: string) => {
//     appLibrary.showloading();
//     try {
//       const { code } = await recruitmentsAPI.deleteRecruitment(id);
//       if (code === SV_RES_STATUS_CODE.success) {
//         message.success('Xóa tin tuyển dụng thành công');
//         setDataTable((pre) => pre.filter((item) => item.id !== id));
//         setFilteredData((pre) => pre.filter((item) => item.id !== id));
//       }
//       appLibrary.hideloading();
//     } catch (error) {
//       appLibrary.hideloading();
//       console.log(error.message);
//       showResponseError(error);
//     }
//   };
//   const handlePublishRecruitment = (value: any, id: string) => {
//     return onPushlishRecruitment(id, value);
//   };
//   const onPushlishRecruitment = async (id: string, statusId: StatusId) => {
//     appLibrary.showloading();
//     try {
//       const { code } = await recruitmentsAPI.updateRecruittmentStatus(id, {
//         status_id: statusId,
//       });
//       if (code === SV_RES_STATUS_CODE.success) {
//         message.success('Cập nhật thành công');
//         setDataTable(
//           dataTable.map((item) => {
//             if (item.id === id) {
//               return {
//                 ...item,
//                 status_id: statusId,
//               };
//             }
//             return item;
//           })
//         );
//       }
//       appLibrary.hideloading();
//     } catch (error) {
//       appLibrary.hideloading();
//       console.log(error.message);
//       showResponseError(error);
//     }
//   };
//   const renderCell = useMemo(
//     // eslint-disable-next-line react/display-name
//     () => (item: IRecruitment, columnKey: React.Key) => {
//       const cellValue = item[columnKey];
//       switch (columnKey) {
//         case 'name':
//           return (
//             <User
//               squared
//               src={item?.image_url ?? SrcIcons.iconYouth}
//               size="xl"
//               name={item.title}
//             ></User>
//           );
//         case 'applicant_count':
//           return (
//             <Col>
//               <Row>
//                 <span className="text-[14px]">{item?.view_count}</span>
//               </Row>
//             </Col>
//           );
//         case 'status':
//           return (
//             <span className="text-[#696974] flex justify-start items-center gap-2">
//               {ApproveStatusIdSVG[item.approve_status_id]}
//               {item.approve_status_id === ApproveStatusId.APPROVED ? (
//                 ApproveStatusId.VN_APPROVED
//               ) : item.approve_status_id === ApproveStatusId.REJECTED ? (
//                 <Tooltip content={`Lý do từ chối: ${item?.reason_of_rejection ?? ''}`}>
//                   {ApproveStatusId.VN_REJECTED}
//                 </Tooltip>
//               ) : (
//                 ApproveStatusId.VN_PENDING
//               )}
//             </span>
//           );
//         case 'actions':
//           return (
//             <Row align="flex-start">
//               <Tooltip content="Sửa" css={{ marginRight: 20 }}>
//                 <IconButton
//                   onClick={() => {
//                     router.push(
//                       `/admin/tin-tuyen-dung/danh-sach-dang-tin/chinh-sua/?id=${item.id}`,
//                       undefined,
//                       {
//                         shallow: true,
//                       }
//                     );
//                   }}
//                 >
//                   <Image
//                     src={SrcIcons.editActionIcon}
//                     height={24}
//                     width={24}
//                     alt="icon"
//                   />
//                 </IconButton>
//               </Tooltip>

//               <Popconfirm
//                 placement="leftTop"
//                 title={'Bạn có chắc chắn muốn xóa bài test này?'}
//                 onConfirm={() => {
//                   handleDeleteRecruitment(item?.id);
//                 }}
//                 okText="Xóa"
//                 cancelText="Hủy"
//               >
//                 <Tooltip content="Xóa" color="error">
//                   <IconButton>
//                     <Image
//                       src={SrcIcons.deleteActionIcon}
//                       height={24}
//                       width={24}
//                       alt="icon"
//                     />
//                   </IconButton>
//                 </Tooltip>
//               </Popconfirm>
//             </Row>
//           );
//         case 'created_at':
//           return (
//             <span className="text-[#696974]">
//               {moment(item.updated_at).format('DD/MM/YYYY')}
//             </span>
//           );
//           return;
//         case 'published':
//           return (
//             <Row css={{ marginLeft: 20 }}>
//               <Checkbox
//                 defaultSelected={item.active_status_id === StatusId.ACTIVE}
//                 onChange={(value) => handlePublishRecruitment(Number(value), item.id)}
//                 aria-label="Checkbox"
//                 color="success"
//               />
//             </Row>
//           );
//         default:
//           return cellValue;
//       }
//     },
//     []
//   );
//   const onSearch = async (value: string) => {
//     if (value === '') {
//       // return setDataTable(props.recruitments);
//     }
//     const newData = filteredData.filter((item) =>
//       Common.removeVietnameseTones(item.title)
//         .toLowerCase()
//         .includes(Common.removeVietnameseTones(value).toLowerCase())
//     );
//     setDataTable(newData);
//   };

//   const handleSearch = debounce((event) => {
//     const { value } = event.target;
//     onSearch(value);
//   }, 100);
//   return (
//     <>
//       <div className="flex mb-[1rem] gap-3">
//         <Input
//           size="large"
//           placeholder="Tìm kiếm nghề "
//           className="rounded-[10px] bg-white"
//           allowClear
//           onChange={handleSearch}
//           prefix={<Image src={SrcIcons.searchIcon} width={18} height={18} alt="youth" />}
//         />
//       </div>
//       <Table
//         selectionMode="none"
//         lang="vi"
//         sticked={false}
//         lined
//         aria-label="Danh sách bài test"
//         aria-labelledby="Danh sách bài test"
//         css={{ background: 'white', height: 'auto', minWidth: '100%' }}
//         striped
//         color="secondary"
//       >
//         <Table.Header columns={columns}>
//           {(column) => (
//             <Table.Column
//               key={column.uid}
//               align={'start'}
//               allowsSorting={column.uid !== 'actions' && column.uid !== 'published'}
//             >
//               {column.name}
//             </Table.Column>
//           )}
//         </Table.Header>
//         <Table.Body items={dataTable}>
//           {(item) => (
//             <Table.Row>
//               {(columnKey) => <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>}
//             </Table.Row>
//           )}
//         </Table.Body>
//         <Table.Pagination
//           noMargin
//           align="center"
//           rowsPerPage={7}
//           onPageChange={(page) => console.log({ page })}
//         />
//       </Table>
//     </>
//   );
// };

// export default RecruitmentDashboard;
