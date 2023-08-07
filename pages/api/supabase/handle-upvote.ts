import { NextApiRequest, NextApiResponse } from "next"

import supabase from "@/lib/supabase-client"

interface UpvoteRequest {
  removeUpvote: boolean
  userId: string
  text: string
  translation: string
}

const handleUpvote = async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    removeUpvote: removeUpvote,
    userId,
    text,
    translation,
  }: UpvoteRequest = req.body

  if (removeUpvote) {
    const { error, status } = await supabase
      .from("translations")
      .delete()
      .match({ user_id: userId, text, translation })

    return error
      ? res.status(status || 500).json({ error: error.message })
      : res
          .status(200)
          .json({ upvoted: false, message: "Translation removed." })
  }

  const { data, error, status } = await supabase
    .from("translations")
    .upsert({ user_id: userId, text, translation, is_user_translation: false })

  return error
    ? res
        .status(status || 500)
        .json({ upvoted: status === 409 ? true : false, error: error.message })
    : res.status(200).json({ upvoted: true, message: "Translation added." })
}

export default handleUpvote
