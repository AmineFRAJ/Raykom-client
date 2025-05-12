/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import PollCard from "../../components/PollCards/PollCard";
import InfiniteScroll from "react-infinite-scroll-component";
import EmptyCard from "../../components/cards/EmptyCard";
import VOTED_ICON from "../../assets/images/voted-icon-image.png";

const PAGE_SIZE = 10;
const VotedPolls = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [votedPolls, setVotedPolls] = useState([]);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  };
  const fetchAllPolls = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.POLLS.VOTED_POLLS, {
        params: {
          page,
          limit: PAGE_SIZE,
        },
      });
      if (response?.data?.polls?.length > 0) {
        setVotedPolls((prevPolls) => {
          const newPolls = response.data.polls.filter(
            (newPoll) => !prevPolls.some((poll) => poll._id === newPoll._id)
          );
          return [...prevPolls, ...newPolls];
        });
        setHasMore(response.data.polls.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("something went wrong", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPolls();

    return () => {};
  }, [page]);

  return (
    <DashboardLayout activeMenu="Voted Polls">
      <div className="my-5 mx-auto ">
        <h2 className="text-xl font-medium text-black">Voted Polls</h2>{" "}
        {votedPolls.length === 0 && !loading && (
          <EmptyCard
            imgSrc={VOTED_ICON}
            message="You have not voted on any poll yet ! start exploring and share your opinion😁!!"
            btnText="Explore"
            onClick={() => navigate("/dashboard")}
          />
        )}
        <InfiniteScroll
          dataLength={votedPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className="info-text">Loading...</h4>}
          endMessage={
            votedPolls.length > 0 ? (
              <p className="info-text">No more polls to display.</p>
            ) : null
          }
        >
          {votedPolls.map((poll) => (
            <PollCard
              key={`dashboard_${poll._id}`}
              pollId={poll._id}
              question={poll.question}
              type={poll.type}
              options={poll.options}
              voters={poll.voters.length || 0}
              responses={poll.responses || []}
              creatorProfileImg={poll.creator.profileImageUrl || null}
              creatorName={poll.creator.fullName}
              creatorUsername={poll.creator.username}
              userHasVoted={poll.userHasVoted || false}
              isPollClosed={poll.closed || false}
              createdAt={poll.createdAt || false}
            />
          ))}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default VotedPolls;
