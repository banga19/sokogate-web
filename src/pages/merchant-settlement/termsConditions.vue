<template>
    <b-container class="terms-conditions-page">
        <div v-title :data-title="$t('menuitems.layout.termsconditions')">
            <Breadcrumb :items="items" />

            <!-- 加载状态 -->
            <div v-if="loading" class="text-center py-5">
                <b-spinner variant="primary" />
            </div>

            <!-- 条款内容 -->
            <div v-else-if="currentTerms" class="terms-content">
                <!-- 标题 -->
                <h1 class="terms-title mb-4">{{ currentTerms.title }}</h1>

                <!-- 条款列表 -->
                <div
                    v-for="section in currentTerms.sections"
                    :key="section.id"
                    class="section mb-5"
                >
                    <!-- 主标题 -->
                    <h2 class="section-heading">
                        <span class="section-number">{{ section.id }}.</span>
                        {{ section.heading }}
                    </h2>

                    <!-- 主内容 -->
                    <div class="section-content">
                        <!-- 处理多行内容 -->
                        <template
                            v-if="
                                section.content &&
                                section.content.includes('\n')
                            "
                        >
                            <p
                                v-for="(
                                    paragraph, idx
                                ) in section.content.split('\n')"
                                :key="idx"
                                class="mb-2"
                            >
                                {{ paragraph }}
                            </p>
                        </template>
                        <template v-else>
                            <p>{{ section.content }}</p>
                        </template>
                    </div>

                    <!-- 子条款 -->
                    <div
                        v-if="section.subsections && section.subsections.length"
                        class="subsections mt-4"
                    >
                        <div
                            v-for="subsection in section.subsections"
                            :key="subsection.id"
                            class="subsection mb-4"
                        >
                            <h3 class="subsection-heading">
                                <span class="subsection-number"
                                    >{{ section.id }}.{{
                                        subsection.id.split('.')[1]
                                    }}</span
                                >
                                {{ subsection.heading }}
                            </h3>
                            <div class="subsection-content">
                                <!-- 处理子条款的多行内容 -->
                                <template
                                    v-if="subsection.content.includes('\n')"
                                >
                                    <p
                                        v-for="(
                                            paragraph, idx
                                        ) in subsection.content.split('\n')"
                                        :key="idx"
                                        class="mb-2"
                                    >
                                        {{ paragraph }}
                                    </p>
                                </template>
                                <template v-else>
                                    <p>{{ subsection.content }}</p>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 最后更新信息 -->
                <div class="last-updated mt-5 pt-4 border-top">
                    <p class="text-muted small">
                        Terms last updated: {{ getCurrentDate() }}
                    </p>
                </div>
            </div>

            <!-- 无内容提示 -->
            <div v-else class="no-content text-center py-5">
                <p>{{ $t('terms.noContent') }}</p>
            </div>
        </div>
    </b-container>
</template>

<script>
import Breadcrumb from '@/components/Breadcrumb.vue'
import amh from './terms/amh'
import ara from './terms/ara'
import fra from './terms/fra'
import hi from './terms/hi'
import per from './terms/per'
import pt from './terms/pt'
import ru from './terms/ru'
import spa from './terms/spa'
import zh from './terms/zh'
import en from './terms/en'

export default {
    components: { Breadcrumb },
    data() {
        return {
            items: [
                {
                    text: this.$t('menuitems.home'),
                    to: { name: 'merchant_settlement' },
                },
                {
                    text: this.$t('menuitems.layout.termsconditions'),
                    active: true,
                },
            ],
            loading: true,
            termsData: {
                amh: amh,
                ara: ara,
                fra: fra,
                hi: hi,
                per: per,
                pt: pt,
                ru: ru,
                spa: spa,
                zh: zh,
                en: en,
            },
        }
    },
    computed: {
        locale() {
            return this.$i18n.locale
        },
        currentTerms() {
            // 获取当前语言的条款，如果不存在则返回默认语言（英语）
            const lang = this.locale in this.termsData ? this.locale : 'en'
            return this.termsData[lang]
        },
    },
    mounted() {
        // 模拟加载延迟
        setTimeout(() => {
            this.loading = false
        }, 300)
    },
    methods: {
        getCurrentDate() {
            return '2025-12-23'
        },
    },
}
</script>

<style lang="scss" scoped>
.terms-conditions-page {
    padding: 2rem 0;

    .terms-title {
        font-style: normal;
        font-weight: bold;
        font-size: 28px;
        line-height: 1.3;
        color: #2c3e50;
        text-align: center;
        margin-bottom: 2.5rem;

        @media (max-width: 768px) {
            font-size: 24px;
        }
    }

    .section {
        background: #fff;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: box-shadow 0.3s ease;

        &:hover {
            box-shadow: 0 4px 12px rgba(239, 46, 34, 0.1);
        }

        .section-heading {
            font-style: normal;
            font-weight: bold;
            font-size: 20px;
            line-height: 1.4;
            color: #34495e;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #ef2e22;

            .section-number {
                display: inline-block;
                width: 30px;
                color: #ef2e22;
                font-weight: bold;
            }
        }

        .section-content {
            p {
                font-weight: normal;
                font-size: 15px;
                line-height: 1.8;
                color: #2c3e50;
                margin-bottom: 0.5rem;
                text-align: justify;

                &:last-child {
                    margin-bottom: 0;
                }

                a {
                    color: #ef2e22;
                    text-decoration: none;
                    transition: color 0.3s ease;

                    &:hover {
                        color: #d0261a;
                        text-decoration: underline;
                    }
                }
            }
        }

        .subsections {
            margin-left: 1rem;
            padding-left: 1.5rem;
            border-left: 2px solid #f8d7da;

            .subsection {
                .subsection-heading {
                    font-style: normal;
                    font-weight: bold;
                    font-size: 17px;
                    line-height: 1.4;
                    color: #2c3e50;
                    margin-bottom: 0.75rem;

                    .subsection-number {
                        display: inline-block;
                        min-width: 40px;
                        color: #ef2e22;
                        font-weight: bold;
                    }
                }

                .subsection-content {
                    p {
                        font-weight: normal;
                        font-size: 14px;
                        line-height: 1.7;
                        color: #2c3e50;
                        margin-bottom: 0.5rem;
                        text-align: justify;

                        &:last-child {
                            margin-bottom: 0;
                        }

                        /* 子条款中的链接 */
                        a {
                            color: #ef2e22;
                            text-decoration: none;
                            transition: color 0.3s ease;

                            &:hover {
                                color: #d0261a;
                                text-decoration: underline;
                            }
                        }
                    }
                }
            }

            @media (max-width: 768px) {
                margin-left: 0.5rem;
                padding-left: 1rem;
            }
        }

        @media (max-width: 768px) {
            padding: 1rem;
            margin-bottom: 1.5rem;
        }
    }

    .last-updated {
        p {
            font-size: 13px;
            color: #ef2e22;
            text-align: center;
            opacity: 0.8;
        }
    }

    .no-content {
        p {
            font-size: 16px;
            color: #7f8c8d;
        }
    }
}

:deep(.spinner-border) {
    color: #ef2e22;
}

// RTL语言支持
[dir='rtl'] {
    .section {
        .subsections {
            border-left: none;
            border-right: 2px solid #f8d7da;
        }
    }
}

// 对于列表项，如果需要可以添加主题色的项目符号
.section-content,
.subsection-content {
    ul,
    ol {
        padding-left: 1.5rem;

        li {
            color: #2c3e50;
            margin-bottom: 0.5rem;
            position: relative;

            &::before {
                content: '•';
                color: #ef2e22;
                font-weight: bold;
                position: absolute;
                left: -1rem;
            }
        }
    }
}

// RTL语言的项目符号调整
[dir='rtl'] {
    .section-content,
    .subsection-content {
        ul,
        ol {
            padding-left: 0;
            padding-right: 1.5rem;

            li {
                &::before {
                    left: auto;
                    right: -1rem;
                }
            }
        }
    }
}
</style>
