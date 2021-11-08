import Vue from "vue";
import Vuex from 'vuex';

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
        count: 0,
        menuindex:0,
        isShowModelList:false,
        isshowTexturexFrame:false,
        mytextures:[]

    },
    // commit触发，只能同步
    mutations: {
        // 进行数据更新，改变数据状态
        countType(state, action){
            state.count =  state.count + action.payload
        },

        updatemenuindex(state, index){
            state.menuindex = index;
        },

        showModelList(state, show){
            state.isShowModelList = show;
        },
        showTexturexFrame(state, show){
            state.isshowTexturexFrame = show;
        },
        addtexture(state,textures){
            textures.forEach(texture =>{
                if(state.mytextures.findIndex(item => item.id === texture.id)<0)
                    state.mytextures.push(texture);
            })


        },
        removetexture(state,textures){
            textures.forEach(texture =>{
                let index = state.mytextures.findIndex(item => item.id === texture.id);
                if(index>0){
                    state.mytextures.splice(index,1);
                }
            });


        }
    },

    //用dispatch 触发  可以异步
    actions: {
        //执行动作，数据请求
        addCount({commit}){
            fetch('../data.json')
                .then(function(response) {
                    return response.json();
                })
                .then(function(myJson) {
                    let action = {
                        type: 'countType',
                        payload: myJson.text
                    }
                    commit(action)
                });
        }
    },
    getters: {
        // 获取到最终的数据结果
        getCount(state){
            return state.count
        }
    },
    //多模块
    modules:{},
});
