import { useEffect, useState } from "react";
import { Input, Button, Table, Space } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

// const dataSource = [
// 	{ id: 31054, location: "Plaza Hotel", year: 1933, dish_count: 4053 },
// 	{ id: 34201, location: "Waldorf Astoria", year: 1914, dish_count: 21312 },
// ];

function ViewMenuList(props) {
	let { menuList } = props;
	const paginationProps = {
		total: menuList.length,
	};
	const columns = [
		{
			title: "Location",
			dataIndex: "location",
			key: "location",
			defaultSortOrder: "descend",
			sorter: (a, b) => a.location - b.location,
		},
		{
			title: "Year",
			dataIndex: "year",
			key: "year",
			defaultSortOrder: "descend",
			sorter: (a, b) => a.year - b.year,
		},
		{
			title: "Dish Count",
			dataIndex: "dish_count",
			key: "dish_count",
			defaultSortOrder: "descend",
			sorter: (a, b) => a.dish_count - b.dish_count,
		},
		{
			title: "Action",
			key: "action",
			render: (_, record) => (
				<Space size="middle">
					<Link to={`/menu_list/${record.id}`} key={record.id}>
						Detail
					</Link>
				</Space>
			),
		},
	];
	return (
		<div>
			<Table columns={columns} dataSource={menuList} pagination={paginationProps} />
		</div>
	);
}

export default function MenuList() {
	const [inputValue, setInputValue] = useState("");
	const [menuList, setMenuList] = useState([]);
	const [firstRender, setFirstRender] = useState(true);
	useEffect(() => {
		firstRender && axiosGET();
	});
	const axiosGET = (searchKey = "", orderBy = "location", startPos = 0, pageSize = 100) => {
		firstRender && setFirstRender(false);
		axios
			.get("http://localhost:3306/showMenuInfo", {
				params: {
					searchKey: searchKey,
					orderBy: orderBy,
					startPos: startPos,
					pageSize: pageSize,
				},
			})
			.then((res) => {
				console.log("success GET!");
				console.log("res.data", res.data);
				const newList = res.data[0];
				console.log("newList", newList);
				setMenuList(newList);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	let inputValueChange = (e) => {
		setInputValue(e.target.value);
	};

	let AddTask = () => {
		axiosGET(inputValue);
		setInputValue("");
	};

	return (
		<div>
			<Input.Group compact>
				<Input
					style={{
						width: "calc(100% - 200px)",
					}}
					defaultValue="https://ant.design"
					value={inputValue}
					onPressEnter={AddTask}
					onChange={inputValueChange}
				/>
				<Button type="primary" onClick={AddTask}>
					Search
				</Button>
			</Input.Group>
			<ViewMenuList menuList={menuList} />
		</div>
	);
}
