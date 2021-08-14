import React, { memo, useEffect, useState, useCallback } from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import { Row, Col } from 'antd';
import api from '../../services/api';
import Actions from '../Home/components/Actions';
import { createMarkup } from '../../utils';
import './styles.css'

function Post() {

    const { id, subject } = useParams();
    const [post, setPost] = useState({});
    const [news, setNews] = useState({});
    const history = useHistory();

    const renderImg = ({ image, description }) => <img src={image.url} alt={description} width='75%' />

    const handleNews = useCallback((data) => {
        setNews(data[0]?.value)
        setPost(data[1]?.value)
    }, [])

    useEffect(() => {

        Promise.allSettled([
            api.getNews(subject),
            api.getNewsById(subject, id)
        ]).then(handleNews)

    }, [id, subject, handleNews])

    const renderDescription = (description) => <p dangerouslySetInnerHTML={createMarkup(description)} />

    const openPost = (id) => {
        history.push(`/${subject}/${id}`)
    }

    const renderPost = (post, index) => {
        const { title, image, description, id } = post;

        return (
            <Col span={12} key={`post-${index}`}>
                <article onClick={() => openPost(id)}>
                    <p>
                        <strong dangerouslySetInnerHTML={createMarkup(title)}></strong>
                    </p>
                    {image.url ? renderImg({ image, description }) : renderDescription(description)}
                </article>
            </Col>
        )
    }

    if (!post?.id) return null

    const { title, image, description, datePublished, body } = post

    return (
        <div>
            <Link to='/'>Back</Link>
            <Actions post={post} subject={subject} />
            <Row gutter={[16, 16]}>
                <Col span={24} md={16}>
                    <p>{datePublished}</p>
                    <h1 dangerouslySetInnerHTML={createMarkup(title)} />
                    {image && renderImg({ image, description })}
                    <p className="text" dangerouslySetInnerHTML={createMarkup(description)} />
                    <hr />
                    <p className="text" dangerouslySetInnerHTML={createMarkup(body)} />
                </Col>
                <Col span={24} md={8}>
                    <Row gutter={[16, 16]}>
                        {news.value?.map(renderPost)}
                    </Row>
                </Col>
            </Row>
        </div >
    )
}

export default memo(Post)
