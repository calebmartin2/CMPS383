import axios from "axios";
import { useState, useEffect } from 'react';

export function TagList() {
    const [tagList, setTagList] = useState([]);

    useEffect(() => {
        async function fetchTagList() {
            axios.get('/api/products/get-tags')
                .then(function (response) {
                    console.log(response.data);
                    const data = response.data;
                    setTagList(data);
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        fetchTagList();
    }, [])

    return (
        <>
            {tagList.map((tag) => (
                <p key={tag.id}>
                    {tag.name}
                </p>
            ))
            }
        </>
    );
}