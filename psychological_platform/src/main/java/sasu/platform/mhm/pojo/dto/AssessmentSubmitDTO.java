package sasu.platform.mhm.pojo.dto;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Data
public class AssessmentSubmitDTO {

    private String recordId;

    @JsonDeserialize(using = AnswerItemListDeserializer.class)
    private List<AnswerItem> answers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerItem {
        private String questionId;
        private Object answer;
    }

    public static class AnswerItemListDeserializer extends JsonDeserializer<List<AnswerItem>> {
        @Override
        public List<AnswerItem> deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            JsonNode node = p.getCodec().readTree(p);
            List<AnswerItem> result = new ArrayList<>();

            if (node.isArray()) {
                for (JsonNode item : node) {
                    AnswerItem answerItem = new AnswerItem();
                    JsonNode questionId = item.get("questionId");
                    if (questionId != null) {
                        answerItem.setQuestionId(questionId.asText());
                    }
                    JsonNode answer = item.get("answer");
                    if (answer != null) {
                        answerItem.setAnswer(answer.isTextual() ? answer.asText() : answer);
                    }
                    result.add(answerItem);
                }
            } else if (node.isObject()) {
                Iterator<String> fieldNames = node.fieldNames();
                while (fieldNames.hasNext()) {
                    String questionId = fieldNames.next();
                    JsonNode answerValue = node.get(questionId);
                    AnswerItem answerItem = new AnswerItem();
                    answerItem.setQuestionId(questionId);
                    answerItem.setAnswer(answerValue.isTextual() ? answerValue.asText() : answerValue);
                    result.add(answerItem);
                }
            }

            return result;
        }
    }
}
