import { useEffect, useState } from "react";
import { Input, Button, Table, Space, Tabs } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

function ViewMenuList(props) {
	let { menuList, numOfMenuItem, current, handleChange, loading } = props;
	const paginationProps = {
		current: current,
		defaultCurrent: 1,
		total: numOfMenuItem,
		onChange: handleChange,
	};
	const columns = [
		{
			title: "Location",
			dataIndex: "location",
			key: "location",
		},
		{
			title: "Year",
			dataIndex: "year",
			key: "year",
		},
		{
			title: "Dish Count",
			dataIndex: "dish_count",
			key: "dish_count",
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
			<Table
				columns={columns}
				dataSource={menuList}
				pagination={paginationProps}
				showSizeChanger={false}
				loading={loading}
			/>
		</div>
	);
}

export default function MenuListByDish() {
	const [inputValue, setInputValue] = useState("");
	const [menuList, setMenuList] = useState([]);
	const [sortBy, setSortBy] = useState("1");
	const [numOfMenuItem, setNumOfMenuItem] = useState(0);
	const [current, setCurrent] = useState(1);
	const [firstRender, setFirstRender] = useState(true);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		firstRender && axiosGET();
	});
	const axiosGET = (searchKey = "", orderBy = "location", startPos = 0, pageSize = 100) => {
		firstRender && setFirstRender(false);
		axios
			.get("http://localhost:3306/searchMenuByDish", {
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
				const menuItem = res.data[1][0].numResult;
				console.log("menuItem", menuItem);
				setMenuList(newList);
				setNumOfMenuItem(menuItem);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	let inputValueChange = (e) => {
		setInputValue(e.target.value);
	};

	let handleSearch = () => {
		setLoading(true);
		switch (sortBy) {
			case "1":
				axiosGET(inputValue, "location");
				break;
			case "2":
				axiosGET(inputValue, "year");
				break;
			case "3":
				axiosGET(inputValue, "dish_count");
				break;
			default:
		}
		setCurrent(1);
	};

	let handleSordBy = (index) => {
		setLoading(true);
		switch (index) {
			case "1":
				setSortBy("1");
				axiosGET(inputValue, "location");
				break;
			case "2":
				setSortBy("2");
				axiosGET(inputValue, "year");
				break;
			case "3":
				setSortBy("3");
				axiosGET(inputValue, "dish_count");
				break;
			default:
		}
		setCurrent(1);
	};

	let handleChange = (page) => {
		setCurrent(page);
		const startPage = Math.floor(menuList.length / 10) - page;
		const shouldGetNewDataFromDB = startPage < 0;
		const axiosAppend = (searchKey = "", orderBy = "location", startPos = 0, pageSize = 100) => {
			axios
				.get("http://localhost:3306/searchMenuByDish", {
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
					setMenuList([...menuList, ...newList]);
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
				});
		};
		const diff = page * 10 - menuList.length;
		if (shouldGetNewDataFromDB && menuList.length < numOfMenuItem) {
			setLoading(true);
			switch (sortBy) {
				case "1":
					axiosAppend(inputValue, "location", menuList.length, diff);
					break;
				case "2":
					axiosAppend(inputValue, "year", menuList.length, diff);
					break;
				case "3":
					axiosAppend(inputValue, "dish_count", menuList.length, diff);
					break;
				default:
			}
		}
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
					onPressEnter={handleSearch}
					onChange={inputValueChange}
				/>
				<Button type="primary" onClick={handleSearch}>
					Search
				</Button>
			</Input.Group>
			<span>Sort By:</span>
			<Tabs
				style={{ display: "inline-block" }}
				defaultActiveKey="1"
				onChange={handleSordBy}
				items={[
					{
						label: `Location`,
						key: "1",
					},
					{
						label: `Year`,
						key: "2",
					},
					{
						label: `Dish Count`,
						key: "3",
					},
				]}
			/>
			<ViewMenuList
				menuList={menuList}
				numOfMenuItem={numOfMenuItem}
				current={current}
				handleChange={handleChange}
				loading={loading}
			/>
		</div>
	);
}
