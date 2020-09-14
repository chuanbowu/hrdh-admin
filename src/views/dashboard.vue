<template>
  <div class="index">
    <div class="Statistics">
      <el-row>
        <el-col :span="8">
          <div class="Statistics-item">
            <div class="statistics-con">
              <div class="title">
                <span>今日流水</span>
                <label>日</label>
              </div>
              <div class="data">
                <span>{{dayPrice}}</span>
              </div>
              <div class="footer">
                <el-row>
                  <el-col :span="12">
                    <div>今日预估流水</div>
                  </el-col>
                  <el-col :span="12">
                    <div class="right">{{dayEstimatedPrice}}</div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="Statistics-item">
            <div class="statistics-con">
              <div class="title">
                <span>本月流水</span>
                <label>月</label>
              </div>
              <div class="data">
                <span>{{monthPrice}}</span>
              </div>
              <div class="footer">
                <el-row>
                  <el-col :span="12">
                    <div>流水预估流水</div>
                  </el-col>
                  <el-col :span="12">
                    <div class="right">{{monthEstimatedPrice}}</div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="Statistics-item">
            <div class="statistics-con">
              <div class="title">
                <span>总流水</span>
                <label>总</label>
              </div>
              <div class="data">
                <span>{{wholePrice}}</span>
              </div>
              <div class="footer">
                <el-row>
                  <el-col :span="12">
                    <div>总预估流水</div>
                  </el-col>
                  <el-col :span="12">
                    <div class="right">{{wholeEstimatedPrice}}</div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { statisticsInfo, sysInfo } from '@/api'
export default {
  data () {
    return {
      serachData: {},
      dayPrice: 0,
      dayEstimatedPrice: 0,
      monthPrice: 0,
      monthEstimatedPrice: 0,
      wholePrice: 0,
      wholeEstimatedPrice: 0
    }
  },
  methods: {
    async getdata () {
      const res = await statisticsInfo(this.serachData)
      if (res.result === '0') {
        this.dayPrice = res.datas.dayPrice
        this.dayEstimatedPrice = res.datas.dayEstimatedPrice
        this.monthPrice = res.datas.monthPrice
        this.monthEstimatedPrice = res.datas.monthEstimatedPrice
        this.wholePrice = res.datas.wholePrice
        this.wholeEstimatedPrice = res.datas.wholeEstimatedPrice
      }
    }
  },
  created () {
    sysInfo()
    this.getdata()
  }
}
</script>
<style lang="less" scoped>
.index {
  height: 100%;
}
.Statistics {
  .Statistics-item {
    padding: 0 10px;
    margin-bottom: 15px;
    .statistics-con {
      // height: 159px;
      padding: 0 10px;
      box-shadow: 0 0 4px rgba(0, 0, 0, .2);
      border-radius: 4px;
      .title {
        height: 50px;
        box-sizing: border-box;
        font-size: 14px;
        font-weight: 700;
        // border-bottom: 1px solid rgba(0, 0, 0, .15);
        position: relative;
        span {
          line-height: 50px;
        }
        label {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translate(0, -50%);
          padding: 5px 10px;
          background: #f6ffed;
          border: 1px solid #b7eb8f;
          border-radius: 3px;
          font-size: 12px;
          color: #52c41a;
        }
      }
      .data {
        padding: 15px 0 20px;
        span {
          font-size: 30px;
          color: #515a6e;
          &.time{
            font-size: 24px;
          }
        }
      }
      .footer {
        border-top: 1px solid rgba(0, 0, 0, .15);
        padding: 12px 0 18px;
        font-size: 13px;
        .right {
          text-align: right;
        }
      }
    }
  }
}
.search-zu {
  margin-left: 10px;
  margin-bottom: 15px;
}
</style>
