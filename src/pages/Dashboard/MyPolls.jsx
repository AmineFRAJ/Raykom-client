/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import HeaderWithFilter from "../../components/layout/HeaderWithFilter";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import PollCard from "../../components/PollCards/PollCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { UserContext } from "../../context/UserContext";
import EmptyCard from "../../components/cards/EmptyCard";
import CREATE_ICON from "../../assets/images/poll-icon-image.png";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 10;

const Mypolls = () => {
  useUserAuth();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [allPolls, setAllPolls] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("");

  const loadMorePolls = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const fetchAllPolls = async (overridePage = page) => {
    if (loading || !user?._id) return;

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `${API_PATHS.POLLS.GET_ALL}?page=${overridePage}&limit=${PAGE_SIZE}&type=${filterType}&creatorId=${user._id}`
      );

      const newPolls = response?.data?.polls || [];

      setAllPolls((prevPolls) =>
        overridePage === 1 ? newPolls : [...prevPolls, ...newPolls]
      );
      setHasMore(newPolls.length === PAGE_SIZE);
    } catch (error) {
      console.error("Failed to fetch polls:", error);
    } finally {
      setLoading(false);
    }
  };

  // Refetch when filter or user changes
  useEffect(() => {
    if (!user?._id) return;
    setPage(1);
    fetchAllPolls(1);
  }, [filterType, user?._id]);

  // Fetch more pages
  useEffect(() => {
    if (page !== 1) {
      fetchAllPolls();
    }
  }, [page]);

  return (
    <DashboardLayout activeMenu="My Polls">
      <div className="my-5 mx-auto">
        <HeaderWithFilter
          title="My Polls"
          filterType={filterType}
          setFilterType={setFilterType}
        />

        {/* Empty state */}
        {!loading && allPolls.length === 0 && page === 1 && (
          <EmptyCard
            imgSrc={CREATE_ICON}
            message="Welcome! No polls created yet 🤔. Start by creating your first poll 😁!"
            btnText="Create Poll"
            onClick={() => navigate("/create-poll")}
          />
        )}

        {/* Infinite scroll block */}
        <InfiniteScroll
          dataLength={allPolls.length}
          next={loadMorePolls}
          hasMore={hasMore}
          loader={<h4 className="info-text">Loading...</h4>}
          endMessage={
            allPolls.length > 0 ? (
              <p className="info-text">No more polls to display.</p>
            ) : null
          }
        >
          {allPolls.map((poll) => (
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
              isMyPoll
            />
          ))}
        </InfiniteScroll>
      </div>
    </DashboardLayout>
  );
};

export default Mypolls;
