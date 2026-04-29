import { useEffect, useState } from "react"
import { getMyInfo } from "../apis/auth"
import type { ResponseMyInfoDto } from "../types/auth";


const MyPage = () => {
    const [data, setData] = useState<ResponseMyInfoDto>([])

    useEffect(() => {
        const getData = async () => {
            const response = await getMyInfo();

            setData(response);

        };

        getData();
    }, []);


    return (
        <div>Mypage{data.data.name} {data.data.email}</div>
    )
}

export default MyPage
